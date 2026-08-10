import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useIntro } from '@/context/IntroContext';
import { useTaxRateCreateSheet } from './modals/TaxRateCreateSheet';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useTaxRateColumns } from './columns';
import { DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';
import { buildDataTableFilterString } from '@/components/shared/data-table/column-filter';
import { useTaxRateStore } from '@/hooks/stores/useTaxRateStore';
import { useTaxRateUpdateSheet } from './modals/TaxRateUpdateSheet';
import { ResponseTaxRateDto } from '@/types';
import { useTaxRateDeleteDialog } from './modals/TaxRateDeleteDialog';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';

interface TaxRatesPortalProps {
  className?: string;
}

export const TaxRatesPortal = ({ className }: TaxRatesPortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      tContentManagement('taxRate.page.title'),
      tContentManagement('taxRate.page.description')
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.taxRates') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const taxRateStore = useTaxRateStore();

  const {
    page,
    setPage,
    size,
    setSize,
    sortDetails,
    setSortDetails,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
    tableReset
  } = useDataTableState('taxrates-table', { order: true, sortKey: 'label' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);
  const { value: debouncedColumnFilters, loading: filtering } = useDebounce<
    Record<string, string>
  >(columnFilters, 500);

  const filterString = React.useMemo(
    () => buildDataTableFilterString([], debouncedColumnFilters),
    [debouncedColumnFilters]
  );

  const {
    data: taxesResp,
    isPending: isFetchPending,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: [
      'tax-rates',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters
    ],
    queryFn: () =>
      api.core.taxRate.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm,
        join: 'currency',
        filter: filterString || undefined
      })
  });

  const taxes = React.useMemo(() => {
    return taxesResp?.data || [];
  }, [taxesResp]);

  const { mutate: createTaxRate, isPending: isCreatePending } = useMutation({
    mutationFn: () => api.core.taxRate.create(taxRateStore.createDto),
    onSuccess: () => {
      toast.success(tContentManagement('taxRate.messages.createSuccess'));
      refetchTaxes();
      taxRateStore.reset();
      closeCreateTaxRateSheet();
    },
    onError: (error) => {
      const message = getErrorMessage(
        'content-management',
        error,
        'taxRate.messages.createFailure'
      );
      toast.error(message);
    }
  });

  const { mutate: updateTaxRate, isPending: isUpdatePending } = useMutation({
    mutationFn: () => api.core.taxRate.update(taxRateStore?.response?.id, taxRateStore.updateDto),
    onSuccess: () => {
      toast.success(tContentManagement('taxRate.messages.updateSuccess'));
      refetchTaxes();
      taxRateStore.reset();
      closeUpdateTaxRateSheet();
    },
    onError: (error) => {
      const message = getErrorMessage(
        'content-management',
        error,
        'taxRate.messages.updateFailure'
      );
      toast.error(message);
    }
  });

  const { mutate: removeTaxRate, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.core.taxRate.remove(id),
    onSuccess: () => {
      if (taxes?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContentManagement('taxRate.messages.deleteSuccess'));
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('content-management', error, 'taxRate.messages.deleteFailure'));
    }
  });

  const { createTaxRateSheet, openCreateTaxRateSheet, closeCreateTaxRateSheet } =
    useTaxRateCreateSheet({
      createTaxRate,
      isCreatePending,
      resetTaxRate: taxRateStore.reset
    });

  const { updateTaxRateSheet, openUpdateTaxRateSheet, closeUpdateTaxRateSheet } =
    useTaxRateUpdateSheet({
      updateTaxRate,
      isUpdatePending,
      resetTaxRate: taxRateStore.reset
    });

  const { deleteTaxRateDialog, openDeleteTaxRateDialog, closeDeleteTaxRateDialog } =
    useTaxRateDeleteDialog({
      representation: taxRateStore?.response?.label,
      deleteTaxRate: () => removeTaxRate(taxRateStore?.response?.id || 0),
      isDeletionPending: isDeletePending,
      reset: taxRateStore.reset
    });

  const context: DataTableConfig<ResponseTaxRateDto> = {
    singularName: tContentManagement('taxRate.entity.singular'),
    pluralName: tContentManagement('taxRate.entity.plural'),
    createCallback: () => {
      openCreateTaxRateSheet();
    },
    updateCallback: () => {
      openUpdateTaxRateSheet();
    },
    deleteCallback: () => {
      openDeleteTaxRateDialog();
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: taxesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    ...tableReset,
    columnFilters,
    setColumnFilter: (filterKey, filterParam) => {
      setPage(1);
      setColumnFilters((previous) => {
        if (!filterParam) {
          const { [filterKey]: _, ...rest } = previous;
          return rest;
        }
        return { ...previous, [filterKey]: filterParam };
      });
    },
    targetEntity: (entity) => {
      taxRateStore.set('response', entity);
      taxRateStore.set('updateDto', {
        label: entity.label,
        value: entity.value,
        type: entity.type,
        special: entity.special,
        currencyId: entity?.currency?.id
      });
    }
  };

  const { currencies } = useCurrencies();
  const currencyFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      currencies.map((currency) => ({
        label: `${currency.label} (${currency.extras.symbol})`,
        filter: `currencyId||$eq||${currency.id}`
      })),
    [currencies]
  );

  const columns = useTaxRateColumns(context, currencyFilterOptions);

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    filtering;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={taxes}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createTaxRateSheet}
      {updateTaxRateSheet}
      {deleteTaxRateDialog}
    </div>
  );
};
