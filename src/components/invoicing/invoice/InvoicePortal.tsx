import React from 'react';
import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useInvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { cn } from '@/lib/utils';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSellingInvoiceColumns } from './columns';
import { toast } from 'sonner';
import { useInvoiceDeleteDialog } from './modals/InvoiceDeleteDialog';
import { ServerErrorResponse } from '@/types';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { Copy, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInvoicePrint } from '@/hooks/content/core/useInvoicePrint';

interface InvoicePortalProps {
  className?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  createdById?: string;
}

export const InvoicePortal = ({
  className,
  enterpriseId,
  interlocutorId,
  createdById
}: InvoicePortalProps) => {
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
        tInvoicing('invoice.intro.title'),
        tInvoicing('invoice.intro.description')
      );
      setRoutes?.([
        { title: t('menu.selling.title'), href: '/selling' },
        { title: tInvoicing('invoice.plural') }
      ]);

      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, interlocutorId, createdById, tInvoicing, t]);

  const invoiceStore = useInvoiceStore();
  const { printTemplateDialog, openPrint, isPrintPending } = useInvoicePrint();

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
  } = useDataTableState('invoiceportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: sellingInvoicesResp,
    isPending: isFetchPending,
    refetch: refetchSellingInvoices,
    error
  } = useQuery({
    queryKey: [
      'selling-invoices',
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
      api.invoicing.invoice.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: [
          'enterprise',
          'interlocutor',
          'quotation',
          'currency',
          'taxWithholding',
          'createdBy',
          'invoiceArticles',
          'invoiceArticles.taxes',
          'payments',
          'payments.payment'
        ].join(','),
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

  const { mutate: duplicateInvoice, isPending: isDuplicatePending } = useMutation({
    mutationFn: (id: number) => api.invoicing.invoice.duplicate(id),
    onSuccess: (data) => {
      toast.success('Invoice duplicated successfully');
      router.push(`/selling/invoices/${data.id}`);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || 'Failed to duplicate invoice');
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
    additionalActions: {
      1: [
        {
          actionCallback: (inv) => openPrint(inv.id),
          actionLabel: t('commands.print', 'Print'),
          actionIcon: <Printer className="h-4 w-4" />,
          isActionVisible: (inv) => inv.isPrintable
        },
        {
          actionCallback: (inv) => duplicateInvoice(inv.id),
          actionLabel: t('commands.duplicate', 'Duplicate'),
          actionIcon: <Copy className="h-4 w-4" />
        }
      ]
    },
    invisibleColumns: ['taxWithholding'],
    columnVisibility,
    setColumnVisibility,
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
    ...tableReset,
    targetEntity: (entity) => {
      invoiceStore.set('response', entity);
    }
  };

  const columns = useSellingInvoiceColumns(context, {
    hideEnterprise: !!enterpriseId,
    hideInterlocutor: !!interlocutorId,
    hideCreatedBy: !!createdById
  });

  const isPending =
    isFetchPending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    isDuplicatePending ||
    isPrintPending;

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
      {printTemplateDialog}
    </div>
  );
};
