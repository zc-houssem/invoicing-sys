import React from 'react';
import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useInvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { cn } from '@/lib/utils';
import { ServerErrorResponse } from '@/api';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSellingInvoiceColumns } from './columns';
import { toast } from 'sonner';
import { useInvoiceDeleteDialog } from './modals/InvoiceDeleteDialog';

interface InvoicePortalProps {
  className?: string;
}

export const InvoicePortal = ({ className }: InvoicePortalProps) => {
  const router = useRouter();

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      'Selling Invoices',
      'Here you can manage your selling invoices, which will be used for sales and invoicing.'
    );
    setRoutes?.([{ title: 'Selling' }, { title: 'Invoice' }]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const invoiceStore = useInvoiceStore();

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
    data: sellingInvoicesResp,
    isPending: isFetchPending,
    refetch: refetchSellingInvoices,
    error
  } = useQuery({
    queryKey: [
      'selling-invoices',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoicing.invoice.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: ['enterprise', 'interlocutor'].join(',')
      })
  });

  const sellingInvoices = React.useMemo(() => {
    return sellingInvoicesResp?.data || [];
  }, [sellingInvoicesResp]);

  const { mutate: deleteInvoice, isPending: isDeleteInvoicePending } = useMutation({
    mutationFn: (id: number) => api.invoicing.invoice.remove(id),
    onSuccess: () => {
      refetchSellingInvoices();
      closeDeleteInvoiceDialog();
      toast.success('Invoice deleted successfully');
    },
    onError: (error: ServerErrorResponse) => {
      console.error('Error deleting invoice:', error);
    }
  });

  const { deleteInvoiceDialog, openDeleteInvoiceDialog, closeDeleteInvoiceDialog } =
    useInvoiceDeleteDialog({
      representation: `Invoice #${invoiceStore.response?.id} - ${invoiceStore.response?.object}`,
      deleteInvoice: () => deleteInvoice(invoiceStore.response?.id!),
      isDeletionPending: isDeleteInvoicePending,
      resetInvoice: () => invoiceStore.reset()
    });

  const context: DataTableConfig<ResponseInvoiceDto> = {
    singularName: 'Invoice',
    pluralName: 'Invoices',
    //dialogs
    createCallback: () => {
      router.push('/selling/invoices/new');
    },
    updateCallback: (invoice) => {
      router.push(`/selling/invoices/${invoice.id}`);
    },
    deleteCallback: (invoice) => {
      invoiceStore.set('response', invoice);
      openDeleteInvoiceDialog();
    },
    additionalActions: {},
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: sellingInvoicesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (entity) => {
      invoiceStore.set('response', entity);
    }
  };

  const columns = useSellingInvoiceColumns(context);

  const isPending = isFetchPending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={sellingInvoices}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {deleteInvoiceDialog}
    </div>
  );
};
