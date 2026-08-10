import React from 'react';
import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig, DataTableColumnFilterOption } from '@/components/shared/data-table/types';
import { buildDataTableFilterString } from '@/components/shared/data-table/column-filter';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { usePaymentColumns } from './columns';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { usePaymentDeleteDialog } from './dialogs/PaymentDeleteDialog';
import { cn } from '@/lib/utils';
import { ResponsePaymentDto } from '@/types/core/invoicing/payment';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';

interface PaymentPortalProps {
  className?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  createdById?: string;
}

export const PaymentPortal = ({
  className,
  enterpriseId,
  interlocutorId,
  createdById
}: PaymentPortalProps) => {
  const router = useRouter();
  const paymentStore = usePaymentStore();
  const { activeCompanyId } = useActiveCompanyContext();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (!enterpriseId && !interlocutorId && !createdById) {
      setIntro?.(tInvoicing('payment.intro.title'), tInvoicing('payment.intro.description'));
      setRoutes?.([
        { title: tCommon('menu.selling.title'), href: '/selling' },
        { title: tInvoicing('payment.plural') }
      ]);
      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, interlocutorId, createdById, tInvoicing, tCommon]);

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
    columnVisibility,
    setColumnVisibility,

    tableReset
  } = useDataTableState('paymentportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);
  const { value: debouncedColumnFilters, loading: filtering } = useDebounce<Record<string, string>>(
    columnFilters,
    500
  );

  const baseFilters = React.useMemo(
    () =>
      [
        activeCompanyId ? `systemEnterpriseId||$eq||${activeCompanyId}` : '',
        enterpriseId ? `enterpriseId||$eq||${enterpriseId}` : '',
        interlocutorId ? `interlocutorId||$eq||${interlocutorId}` : '',
        createdById ? `createdById||$eq||${createdById}` : ''
      ].filter(Boolean),
    [activeCompanyId, enterpriseId, interlocutorId, createdById]
  );

  const filterString = React.useMemo(
    () => buildDataTableFilterString(baseFilters, debouncedColumnFilters),
    [baseFilters, debouncedColumnFilters]
  );

  const {
    data: paymentsResp,
    isPending: isFetchPending,
    refetch: refetchPayments
  } = useQuery({
    queryKey: [
      'payments',
      activeCompanyId,
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters,
      enterpriseId,
      interlocutorId,
      createdById
    ],
    queryFn: () =>
      api.invoicing.payment.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: ['enterprise', 'currency', 'createdBy'].join(','),
        filter: filterString || undefined
      })
  });

  const payments = React.useMemo(() => {
    return paymentsResp?.data || [];
  }, [paymentsResp]);

  //Remove Payment
  const { mutate: removePayment, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.invoicing.payment.remove(id),
    onSuccess: () => {
      if (payments?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('payment.action_remove_success'));
      refetchPayments();
      closeDeletePaymentDialog();
    },
    onError: (error) => {
      toast.error(getErrorMessage('invoicing', error, tInvoicing('payment.action_remove_failure')));
    }
  });

  const { deletePaymentDialog, openDeletePaymentDialog, closeDeletePaymentDialog } =
    usePaymentDeleteDialog({
      representation: paymentStore.response?.sequence
        ? `${paymentStore.response.sequence}`
        : `#${paymentStore.response?.id}`,
      deletePayment: () => paymentStore.response?.id && removePayment(paymentStore.response.id),
      isDeletionPending: isDeletePending,
      resetPayment: () => paymentStore.reset()
    });

  const context: DataTableConfig<ResponsePaymentDto> = {
    singularName: 'Payment',
    pluralName: 'Payments',
    //dialogs
    createCallback: () => {
      router.push('/selling/new-payment');
    },
    updateCallback: (payment) => {
      router.push(`/selling/payments/${payment.id}`);
    },
    deleteCallback: (payment) => {
      paymentStore.set('response', payment);
      openDeletePaymentDialog();
    },
    additionalActions: {},
    columnVisibility,
    setColumnVisibility,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: paymentsResp?.meta.pageCount || 1,
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
      // not used
    }
  };

  const { currencies } = useCurrencies();
  const currencyFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      currencies.map((currency) => ({
        label: currency.label,
        filter: `currencyId||$eq||${currency.id}`
      })),
    [currencies]
  );

  const columns = usePaymentColumns(context, {
    hideEnterprise: !!enterpriseId,
    hideInterlocutor: !!interlocutorId,
    hideCreatedBy: !!createdById
  }, currencyFilterOptions);

  const isPending = isFetchPending || paging || resizing || searching || sorting || filtering;

  return (
    <>
      {deletePaymentDialog}
      <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={payments}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      </div>
    </>
  );
};
