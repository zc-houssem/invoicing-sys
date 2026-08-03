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
}

export const PaymentPortal = ({ className, enterpriseId, interlocutorId }: PaymentPortalProps) => {
  const router = useRouter();
  const paymentStore = usePaymentStore();
  const { activeCompanyId } = useActiveCompanyContext();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (!enterpriseId && !interlocutorId) {
      setIntro?.(tInvoicing('payment.plural'), 'Here you can manage your payments.');
      setRoutes?.([
        { title: tCommon('menu.selling.title'), href: '/selling' },
        { title: tInvoicing('payment.plural') }
      ]);
      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, interlocutorId]);

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
    setColumnFilters
  } = useDataTableState('paymentportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

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
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoicing.payment.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: ['enterprise', 'currency', 'createdBy'].join(','),
        filter:
          [
            activeCompanyId ? `systemEnterpriseId||$eq||${activeCompanyId}` : '',
            enterpriseId ? `enterpriseId||$eq||${enterpriseId}` : '',
            interlocutorId ? `interlocutorId||$eq||${interlocutorId}` : ''
          ]
            .filter(Boolean)
            .join(';') || undefined
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
