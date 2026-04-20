import React from 'react';
import { api } from '@/api';
import { ResponseTaxRateDto, Tax } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useTaxManager } from '../../../hooks/stores/useTaxRateStore';

import { useTaxRateColumns } from './columns';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { cn } from '@/lib/utils';
import { useTaxDeleteDialog } from './modals/TaxRateDeleteDialog';
import { useTaxCreateSheet } from './modals/TaxRateCreateSheet';
import { useTaxUpdateSheet } from './modals/TaxRateUpdateSheet';
import { TAX_FILTER_ATTRIBUTES } from '@/constants/tax.filter-attributes';
import { createTaxSchema, updateTaxSchema } from '@/types/validations/tax.validation';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useIntro } from '@/context/IntroContext';
import { DataTableConfig } from '@/components/shared/data-table/types';

interface TaxRatesPortalProps {
  className?: string;
}

export const TaxRatesPortal = ({ className }: TaxRatesPortalProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      'Tax Rates',
      'Here you can manage your tax rates, which will be applied to your products and services.'
    );
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.system') },
      { title: tCommon('settings.system.tax') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const taxManger = useTaxManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'label' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    isPending: isFetchPending,
    error,
    data: taxesResp,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: [
      'taxe-rates',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.taxRate.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm
      })
  });

  const taxes = React.useMemo(() => {
    return taxesResp?.data || [];
  }, [taxesResp]);

  //create tax
  const { mutate: createTax, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Tax) => api.tax.create(data),
    onSuccess: () => {
      toast.success('Taxe ajoutée avec succès');
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la création du taxe'));
    }
  });

  //update tax
  const { mutate: updateTax, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Tax) => api.tax.update(data),
    onSuccess: () => {
      toast.success('Taxe modifiée avec succès');
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la modification du taxe'));
    }
  });

  //remove tax
  const { mutate: removeTax, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: number) => api.tax.remove(id),
    onSuccess: () => {
      if (taxes?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Taxe supprimée avec succès');
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la suppression du taxe'));
    }
  });

  // const handleValidation = (result: any) => {
  //   const errorMessage = Object.values(result.error.flatten().fieldErrors)
  //     .flat()
  //     .map((error) => `<li>${error}</li>`)
  //     .join('');
  //   toast('⛔ Validation Errors', {
  //     description: <ul dangerouslySetInnerHTML={{ __html: errorMessage }} />
  //   });
  // };

  const context: DataTableConfig<ResponseTaxRateDto> = {
    singularName: 'Tax Rate',
    pluralName: 'Tax Rates',
    createCallback: () => {},
    updateCallback: () => {},
    deleteCallback: () => {},
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: taxesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const columns = useTaxRateColumns(context);

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={taxes}
        context={context}
        columns={columns}
        isPending={isPending}
      />
    </div>
  );
};
