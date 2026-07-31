import React from 'react';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import useInitializedState from '@/hooks/use-initialized-state';
import { useEnterprises } from '@/hooks/content/core/useEnterprises';
import { usePaymentUpdateFormStructure } from './usePaymentUpdateFormStructure';
import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Spinner } from '@/components/shared';
import { Status } from '../../Status';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Repeat2 } from 'lucide-react';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { UpdatePaymentDto } from '@/types/core/invoicing/payment';

interface PaymentFormProps {
  className?: string;
  paymentId: string;
}

export const PaymentUpdateForm = ({ className, paymentId }: PaymentFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const store = usePaymentStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  //Fetch options
  const {
    isPending: isFetchPending,
    data: paymentResp,
    refetch: refetchInvoice
  } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () =>
      api.invoicing.payment.findById(
        parseInt(paymentId),
        'enterprise,currency,interlocutor,uploads.upload,invoices.invoice'
      )
  });

  const payment = React.useMemo(() => {
    return paymentResp || null;
  }, [paymentResp]);

  React.useEffect(() => {
    if (payment?.id) {
      setRoutes?.([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tInvoicing('payment.plural'), href: '/selling/payments' },
        { title: tInvoicing('payment.singular') + ' N° ' + payment?.id }
      ]);
      return () => clearRoutes?.();
    }
  }, [router.locale, payment?.id]);

  // Fetch options
  const { currencies, isCurrenciesPending: isFetchCurrenciesPending } = useCurrencies();
  const { cabinet, isFetchCabinetPending } = useCabinet();

  React.useEffect(() => {
    store.setNested('updateDto.currencyId', cabinet?.currency?.id);
  }, [cabinet]);

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['currency', 'invoices', 'invoices.currency'],
    excludeSystem: true
  });
  
  const fetching =
    isFetchPending || isEnterprisesPending || isFetchCurrenciesPending || isFetchCabinetPending;

  const setPaymentData = (data: any) => {
    if (!data) return;
    store.set('response', data);
    store.set('updateDto', {
      amount: data.amount,
      fee: data.fee,
      convertionRate: data.convertionRate,
      date: data.date,
      mode: data.mode,
      notes: data.notes,
      enterpriseId: data.enterpriseId,
      interlocutorId: data.interlocutorId,
      currencyId: data.currencyId,
      invoices:
        data.invoices?.map((i: any) => ({ invoiceId: i.invoiceId, amount: i.amount })) || [],
      uploads: data.uploads?.map((u: any) => ({ uploadId: u.uploadId })) || []
    });

    // map files if you have a file logic
    const files =
      data.uploads?.map((u: any) => ({
        upload: u.upload,
        file: new File([], u.upload?.filename || 'file') // mock file to show, usually logic is different
      })) || [];
    store.set('files', files);
  };

  const { isDisabled, globalReset } = useInitializedState({
    data: payment || {},
    getCurrentData: () => {
      return {
        payment: store.updateDto
      };
    },
    setFormData: (data: any) => {
      setPaymentData(data);
    },
    resetData: () => {
      store.reset();
    },
    loading: fetching
  });

  const currency = React.useMemo(() => {
    return currencies.find((c) => c.id === store.updateDto?.currencyId);
  }, [store.updateDto?.currencyId, currencies]);

  const { mutate: updatePayment, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { payment: UpdatePaymentDto; id: number }) =>
      api.invoicing.payment.update(data.id, data.payment),
    onSuccess: () => {
      toast.success('Paiement modifié avec succès');
      router.push('/selling/payments');
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la mise à jour de paiement');
      toast.error(message);
    }
  });

  const onSubmit = () => {
    if (!store.updateDto) return;
    const paymentUpdate: UpdatePaymentDto = {
      ...store.updateDto
      // upload mapping if you use file upload system separately, for now keep what's in updateDto
    };

    // validation logic from before omitted
    updatePayment({
      payment: paymentUpdate,
      id: parseInt(paymentId)
    });
  };

  const { mainFormStructure } = usePaymentUpdateFormStructure({
    store,
    enterprises: enterprises || [],
    currencies: currencies.filter(
      (c) => c.id == cabinet?.currencyId || c.id == store.updateDto?.currencyId
    ),
    loading: fetching
  });

  if (fetching) {
    return <Spinner className="items-start justify-start pt-8" />;
  }

  return (
    <InvoicingFormLayout
      className={className}
      isMobile={isMobile}
      sidebarTitle={tCommon('commands.actions')}
      main={<FormBuilder structure={mainFormStructure} />}
      sidebar={
        <>
          <Status className="mx-auto" status={payment?.status || 'Draft'} />
          <Separator />
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs font-bold">Actions</Label>
            <Button
              type="button"
              size="lg"
              className="rounded-xl"
              variant={'outline'}
              disabled={isDisabled || isUpdatePending}
              onClick={() => {
                onSubmit();
              }}>
              <Save className="size-16" />
              <span>{tCommon('commands.save')}</span>
            </Button>
            <Button
              type="button"
              size="lg"
              className="rounded-xl"
              variant={'ghost'}
              disabled={isUpdatePending}
              onClick={() => {
                globalReset();
              }}>
              <Repeat2 className="size-16" />
              <span>{tCommon('commands.reset')}</span>
            </Button>
          </div>
        </>
      }
    />
  );
};
