import React from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { DuplicateInvoiceDto, Invoice } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoiceManager } from './hooks/useInvoiceManager';
import { InvoiceDeleteDialog } from './dialogs/InvoiceDeleteDialog';
import { InvoiceDuplicateDialog } from './dialogs/InvoiceDuplicateDialog';
import { InvoiceDownloadDialog } from './dialogs/InvoiceDownloadDialog';
import { useIntro } from '@/context/IntroContext';
import { DataTable } from '@/components/shared/data-table/data-table';
import { cn } from '@/lib/utils';
import { useInvoiceColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';

interface InvoicePortalProps {
  className?: string;
  firmId?: number;
  interlocutorId?: number;
}

export const InvoicePortal = ({ className, firmId, interlocutorId }: InvoicePortalProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.(
      tCommon('routes.selling.invoice.title'),
      tCommon('routes.selling.invoice.description')
    );
    setRoutes?.([
      { title: tCommon('menu.selling'), href: '/selling' },
      { title: tCommon('submenu.invoices') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const invoiceManager = useInvoiceManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: invoicesResp,
    refetch: refetchInvoices
  } = useQuery({
    queryKey: [
      'invoices',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoice.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        ['firm', 'interlocutor', 'currency', 'payments']
      )
  });

  const invoices = React.useMemo(() => {
    return invoicesResp?.data || [];
  }, [invoicesResp]);

  //Remove Invoice
  const { mutate: removeInvoice, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.invoice.remove(id),
    onSuccess: () => {
      if (invoices?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('invoice.action_remove_success'));
      refetchInvoices();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('invoicing', error, tInvoicing('invoice.action_remove_failure')));
    }
  });

  //Duplicate Invoice
  const { mutate: duplicateInvoice, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicateInvoiceDto: DuplicateInvoiceDto) =>
      api.invoice.duplicate(duplicateInvoiceDto),
    onSuccess: async (data) => {
      toast.success(tInvoicing('invoice.action_duplicate_success'));
      await router.push('/selling/invoice/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('invoice.action_duplicate_failure'))
      );
    }
  });

  //Download Invoice
  const { mutate: downloadInvoice, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.invoice.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('invoice.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('invoice.action_download_failure'))
      );
    }
  });

  const context: DataTableConfig<Invoice> = {
    singularName: tInvoicing('invoice.singular'),
    pluralName: tInvoicing('invoice.plural'),
    inspectCallback: () => {},
    createCallback: () => {
      router.push('/selling/new-invoice');
    },
    updateCallback: () => {},
    deleteCallback: () => {},
    additionalActions: {},
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: invoicesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const columns = useInvoiceColumns(context, firmId, interlocutorId);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden container mx-auto', className)}>
      <InvoiceDeleteDialog
        id={invoiceManager?.id}
        sequential={invoiceManager?.sequential || ''}
        open={deleteDialog}
        deleteInvoice={() => {
          invoiceManager?.id && removeInvoice(invoiceManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <InvoiceDuplicateDialog
        id={invoiceManager?.id || 0}
        sequential={invoiceManager?.sequential || ''}
        open={duplicateDialog}
        duplicateInvoice={(includeFiles: boolean) => {
          invoiceManager?.id &&
            duplicateInvoice({
              id: invoiceManager?.id,
              includeFiles: includeFiles
            });
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <InvoiceDownloadDialog
        id={invoiceManager?.id || 0}
        open={downloadDialog}
        downloadInvoice={(template: string) => {
          invoiceManager?.id && downloadInvoice({ id: invoiceManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />

      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={invoices}
        columns={columns}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};
