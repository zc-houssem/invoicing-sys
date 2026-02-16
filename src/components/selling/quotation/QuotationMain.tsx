import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/other/useDebounce';
import { api } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QuotationDuplicateDialog } from './dialogs/QuotationDuplicateDialog';
import { useTranslation } from 'react-i18next';
import { QuotationDeleteDialog } from './dialogs/QuotationDeleteDialog';
import { QuotationDownloadDialog } from './dialogs/QuotationDownloadDialog';
import { getQuotationColumns } from './data-table/columns';
import { useQuotationManager } from './hooks/useQuotationManager';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { DuplicateQuotationDto, Quotation } from '@/types';
import { QuotationInvoiceDialog } from './dialogs/QuotationInvoiceDialog';
import { useIntro } from '@/context/IntroContext';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';

interface QuotationMainProps {
  className?: string;
}

export const QuotationMain: React.FC<QuotationMainProps> = ({ className }) => {
  const router = useRouter();

  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');

  const { setIntro } = useIntro();
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setIntro?.(tInvoicing('quotation.singular'), tInvoicing('quotation.card_description'));
    setRoutes?.([
      { title: tCommon('menu.selling'), href: '/selling' },
      { title: tCommon('submenu.quotations') }
    ]);
  }, [router.locale]);

  const quotationManager = useQuotationManager();

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
  const [invoiceDialog, setInvoiceDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: quotationsResp,
    refetch: refetchQuotations
  } = useQuery({
    queryKey: [
      'quotations',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.quotation.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        ['firm', 'interlocutor', 'currency', 'invoices']
      )
  });

  const quotations = React.useMemo(() => {
    return quotationsResp?.data || [];
  }, [quotationsResp]);

  const context: DataTableConfig<Quotation> = {
    singularName: tInvoicing('quotation.singular'),
    pluralName: tInvoicing('quotation.plural'),

    //dialogs
    createCallback: () => {
      router.push('/selling/new-quotation');
    },
    updateCallback: () => {},
    deleteCallback: () => setDeleteDialog(true),

    // openInvoiceDialog: () => setInvoiceDialog(true),
    // openDownloadDialog: () => setDownloadDialog(true),
    // openDuplicateDialog: () => setDuplicateDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: quotationsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  //Remove Quotation
  const { mutate: removeQuotation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.quotation.remove(id),
    onSuccess: () => {
      if (quotations?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('quotation.action_remove_success'));
      refetchQuotations();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('quotation.action_remove_failure'))
      );
    }
  });

  //Duplicate Quotation
  const { mutate: duplicateQuotation, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicateQuotationDto: DuplicateQuotationDto) =>
      api.quotation.duplicate(duplicateQuotationDto),
    onSuccess: async (data) => {
      toast.success(tInvoicing('quotation.action_duplicate_success'));
      await router.push('/selling/quotation/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('quotation.action_duplicate_failure'))
      );
    }
  });

  //Download Quotation
  const { mutate: downloadQuotation, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.quotation.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('quotation.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('quotation.action_download_failure'))
      );
    }
  });

  //Invoice quotation
  const { mutate: invoiceQuotation, isPending: isInvoicingPending } = useMutation({
    mutationFn: (data: { id?: number; createInvoice: boolean }) =>
      api.quotation.invoice(data.id, data.createInvoice),
    onSuccess: (data) => {
      toast.success('Devis facturé avec succès');
      refetchQuotations();
      router.push(`/selling/invoice/${data.invoices[data?.invoices?.length - 1].id}`);
    },
    onError: (error) => {
      const message = getErrorMessage('contacts', error, 'Erreur lors de la facturation de devis');
      toast.error(message);
    }
  });

  const isPending =
    isFetchPending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    !commonReady ||
    !invoicingReady;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <QuotationDeleteDialog
        id={quotationManager?.id}
        sequential={quotationManager?.sequential || ''}
        open={deleteDialog}
        deleteQuotation={() => {
          quotationManager?.id && removeQuotation(quotationManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <QuotationDuplicateDialog
        id={quotationManager?.id || 0}
        sequential={quotationManager?.sequential || ''}
        open={duplicateDialog}
        duplicateQuotation={(includeFiles: boolean) => {
          quotationManager?.id &&
            duplicateQuotation({
              id: quotationManager?.id,
              includeFiles: includeFiles
            });
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <QuotationDownloadDialog
        id={quotationManager?.id || 0}
        open={downloadDialog}
        downloadQuotation={(template: string) => {
          quotationManager?.id && downloadQuotation({ id: quotationManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <QuotationInvoiceDialog
        id={quotationManager?.id || 0}
        status={quotationManager?.status}
        sequential={quotationManager?.sequential}
        open={invoiceDialog}
        isInvoicePending={isInvoicingPending}
        invoice={(id: number, createInvoice: boolean) => {
          invoiceQuotation({ id, createInvoice });
        }}
        onClose={() => setInvoiceDialog(false)}
      />
      <DataTable
        context={context}
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={quotations}
        columns={getQuotationColumns(tInvoicing, router)}
        isPending={isPending}
      />
    </>
  );
};
