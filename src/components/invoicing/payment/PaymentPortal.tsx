import React from 'react';
import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { usePaymentColumns } from './columns';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { PaymentDeleteDialog } from './dialogs/PaymentDeleteDialog';
import { cn } from '@/lib/utils';
import { ResponsePaymentDto } from '@/types/core/invoicing/payment';
import { useDataTableState } from '@/hooks/other/useDataTableState';

interface PaymentPortalProps {
  className?: string;
  enterpriseId?: number;
  interlocutorId?: number;
}

export const PaymentPortal = ({ className, enterpriseId, interlocutorId }: PaymentPortalProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (!enterpriseId && !interlocutorId) {
      setIntro?.(
        tInvoicing('payment.plural'),
        'Here you can manage your payments.'
      );
      setRoutes?.([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tCommon('submenu.payments') }
      ]);
      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, interlocutorId]);

    const {
    page, setPage,
    size, setSize,
    sortDetails, setSortDetails,
    searchTerm, setSearchTerm,
    columnFilters, setColumnFilters
  } = useDataTableState('paymentportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [paymentToDelete, setPaymentToDelete] = React.useState<number | undefined>();

  const {
    isPending: isFetchPending,
    error,
    data: paymentsResp,
    refetch: refetchPayments
  } = useQuery({
    queryKey: [
      'payments',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoicing.payment.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: 'currency'
        // filter: [
        //   enterpriseId ? `enterpriseId||$eq||${enterpriseId}` : '',
        //   interlocutorId ? `interlocutorId||$eq||${interlocutorId}` : ''
        // ]
        //   .filter(Boolean)
        //   .join(',')
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
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('invoicing', error, tInvoicing('payment.action_remove_failure')));
    }
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
      setPaymentToDelete(payment.id);
      setDeleteDialog(true);
    },
    additionalActions: {},
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
    targetEntity: (entity) => {
      // not used
    }
  };

  const columns = usePaymentColumns(context);

  const isPending = isFetchPending || paging || resizing || searching || sorting;

  return (
    <>
      <PaymentDeleteDialog
        id={paymentToDelete}
        open={deleteDialog}
        deletePayment={() => {
          paymentToDelete && removePayment(paymentToDelete);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
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
