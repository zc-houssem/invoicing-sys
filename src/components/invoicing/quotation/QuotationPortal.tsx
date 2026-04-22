import React from 'react';
import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { ResponseQuotationDto, ServerErrorResponse, UpdateQuotationDto } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSellingQuotationColumns } from './columns';
import { toast } from 'sonner';
import { useQuotationDeleteDialog } from './modals/QuotationDeleteDialog';

interface QuotationPortalProps {
  className?: string;
}

export const QuotationPortal = ({ className }: QuotationPortalProps) => {
  const router = useRouter();

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      'Selling Quotations',
      'Here you can manage your selling quotations, which will be used for sales and invoicing.'
    );
    setRoutes?.([{ title: 'Selling' }, { title: 'Quotation' }]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const quotationStore = useQuotationStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: sellingQuotationsResp,
    isPending: isFetchPending,
    refetch: refetchSellingQuotations,
    error
  } = useQuery({
    queryKey: [
      'selling-quotations',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoicing.quotation.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: ['enterprise', 'interlocutor'].join(',')
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
    additionalActions: {},
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
    targetEntity: (entity) => {
      quotationStore.set('response', entity);
    }
  };

  const columns = useSellingQuotationColumns(context);

  const isPending = isFetchPending || paging || resizing || searching || sorting;

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
