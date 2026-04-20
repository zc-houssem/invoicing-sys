import React from 'react';
import { api } from '@/api';
import { Tax } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useTaxManager } from './hooks/useTaxManager';
import { DataTable } from './data-table/data-table';
import { TaxActionsContext } from './data-table/ActionDialogContext';
import { getTaxColumns } from './data-table/columns';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import ContentSection from '@/components/shared/ContentSection';
import { cn } from '@/lib/utils';
import { useTaxDeleteDialog } from './modals/TaxDeleteDialog';
import { useTaxCreateSheet } from './modals/TaxCreateSheet';
import { useTaxUpdateSheet } from './modals/TaxUpdateSheet';
import { TAX_FILTER_ATTRIBUTES } from '@/constants/tax.filter-attributes';
import { createTaxSchema, updateTaxSchema } from '@/types/validations/tax.validation';

interface TaxMainProps {
  className?: string;
}

const TaxMain: React.FC<TaxMainProps> = ({ className }) => {
  //next-router
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.system') },
      { title: tCommon('settings.system.tax') }
    ]);
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
      'taxes',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.tax.findPaginated({
        page: debouncedPage,
        limit: debouncedSize,
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        filter: debouncedSearchTerm
          ? Object.values(TAX_FILTER_ATTRIBUTES)
              .map((key) => `${key}||$cont||${debouncedSearchTerm}`)
              .join('||$or||')
          : ''
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
      closeDeleteTaxDialog();
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

  const handleTaxCreateSubmit = () => {
    const tax = taxManger.getTax();
    const result = createTaxSchema.safeParse(tax);
    if (!result.success) {
      taxManger.set('errors', result.error.flatten().fieldErrors);
      return false;
    } else {
      createTax(tax);
      closeCreateTaxSheet();
      taxManger.reset();
      return true;
    }
  };

  const handleTaxUpdateSubmit = () => {
    const tax = taxManger.getTax();
    const validation = api.tax.validate(tax);
    if (validation.message) {
      toast.error(validation.message);
      return false;
    } else {
      updateTax(tax);
      closeUpdateTaxSheet();
      taxManger.reset();
      return true;
    }
  };

  const { createTaxSheet, openCreateTaxSheet, closeCreateTaxSheet } = useTaxCreateSheet(
    handleTaxCreateSubmit,
    isCreatePending,
    taxManger.reset
  );

  const { updateTaxSheet, openUpdateTaxSheet, closeUpdateTaxSheet } = useTaxUpdateSheet(
    handleTaxUpdateSubmit,
    isUpdatePending,
    !taxManger.isChanged(),
    taxManger.reset
  );

  const { deleteTaxDialog, openDeleteTaxDialog, closeDeleteTaxDialog } = useTaxDeleteDialog(
    taxManger.label,
    () => removeTax(taxManger.id),
    isDeletePending
  );

  const context = {
    //dialogs
    openCreateTaxSheet,
    openUpdateTaxSheet,
    openDeleteTaxDialog,
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
    <TaxActionsContext.Provider value={context}>
      <ContentSection
        title={tSettings('tax.singular')}
        desc={tSettings('tax.card_description')}
        className="w-full"
        childrenClassName={cn('overflow-hidden', className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={taxes}
          columns={getTaxColumns(tSettings, tCommon, tCurrency)}
          isPending={isPending}
        />
      </ContentSection>
      {createTaxSheet}
      {updateTaxSheet}
      {deleteTaxDialog}
    </TaxActionsContext.Provider>
  );
};

export default TaxMain;
