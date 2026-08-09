import React from 'react';
import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { ResponseQuotationDto, ServerErrorResponse } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSellingQuotationColumns } from './columns';
import { toast } from 'sonner';
import { useQuotationDeleteDialog } from './modals/QuotationDeleteDialog';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuotationPortalProps {
  className?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  createdById?: string;
}

export const QuotationPortal = ({
  className,
  enterpriseId,
  interlocutorId,
  createdById
}: QuotationPortalProps) => {
  const router = useRouter();
  const { activeCompanyId } = useActiveCompanyContext();
  const { t } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (!enterpriseId && !interlocutorId && !createdById) {
      setIntro?.(
        tInvoicing('quotation.intro.title'),
        tInvoicing('quotation.intro.description')
      );
      setRoutes?.([
        { title: t('menu.selling.title'), href: '/selling' },
        { title: tInvoicing('quotation.plural') }
      ]);

      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, interlocutorId, createdById, tInvoicing, t]);

  const quotationStore = useQuotationStore();

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
  } = useDataTableState('quotationportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: sellingQuotationsResp,
    isPending: isFetchPending,
    refetch: refetchSellingQuotations,
    error
  } = useQuery({
    queryKey: [
      'selling-quotations',
      activeCompanyId,
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      enterpriseId,
      interlocutorId,
      createdById
    ],
    queryFn: () =>
      api.invoicing.quotation.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: ['enterprise', 'interlocutor', 'currency', 'createdBy', 'quotationArticles', 'quotationArticles.taxes'].join(','),
        filter:
          [
            activeCompanyId ? `systemEnterpriseId||$eq||${activeCompanyId}` : '',
            enterpriseId ? `enterpriseId||$eq||${enterpriseId}` : '',
            interlocutorId ? `interlocutorId||$eq||${interlocutorId}` : '',
            createdById ? `createdById||$eq||${createdById}` : ''
          ]
            .filter(Boolean)
            .join(';') || undefined
      })
  });

  const sellingQuotations = React.useMemo(() => {
    return sellingQuotationsResp?.data || [];
  }, [sellingQuotationsResp]);

  const { mutate: deleteQuotation, isPending: isDeleteQuotationPending } = useMutation({
    mutationFn: (id: number) => api.invoicing.quotation.remove(id),
    onSuccess: () => {
      refetchSellingQuotations();
      closeDeleteQuotationDialog();
      toast.success('Quotation deleted successfully');
    },
    onError: (error: ServerErrorResponse) => {
      console.error('Error deleting quotation:', error);
    }
  });

  const { mutate: duplicateQuotation, isPending: isDuplicatePending } = useMutation({
    mutationFn: (id: number) => api.invoicing.quotation.duplicate(id),
    onSuccess: (data) => {
      toast.success('Quotation duplicated successfully');
      router.push(`/selling/quotations/${data.id}`);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || 'Failed to duplicate quotation');
    }
  });

  const { deleteQuotationDialog, openDeleteQuotationDialog, closeDeleteQuotationDialog } =
    useQuotationDeleteDialog({
      representation: `Quotation #${quotationStore.response?.id} - ${quotationStore.response?.object}`,
      deleteQuotation: () => deleteQuotation(quotationStore.response?.id!),
      isDeletionPending: isDeleteQuotationPending,
      resetQuotation: () => quotationStore.reset()
    });

  const context: DataTableConfig<ResponseQuotationDto> = {
    singularName: 'Quotation',
    pluralName: 'Quotations',
    //dialogs
    createCallback: () => {
      router.push('/selling/quotations/new');
    },
    updateCallback: (quotation) => {
      router.push(`/selling/quotations/${quotation.id}`);
    },
    deleteCallback: (quotation) => {
      quotationStore.set('response', quotation);
      openDeleteQuotationDialog();
    },
    additionalActions: {
      1: [
        {
          actionCallback: (q) => duplicateQuotation(q.id),
          actionLabel: t('commands.duplicate', 'Duplicate'),
          actionIcon: <Copy className="h-4 w-4" />
        }
      ]
    },
    columnVisibility,
    setColumnVisibility,
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: sellingQuotationsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    ...tableReset,
    targetEntity: (entity) => {
      quotationStore.set('response', entity);
    }
  };

  const columns = useSellingQuotationColumns(context, {
    hideEnterprise: !!enterpriseId,
    hideInterlocutor: !!interlocutorId,
    hideCreatedBy: !!createdById
  });

  const isPending = isFetchPending || paging || resizing || searching || sorting || isDuplicatePending;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={sellingQuotations}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {deleteQuotationDialog}
    </div>
  );
};
