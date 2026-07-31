import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useFirmChoices from '@/hooks/content/useFirmChoice';
import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import { useEnterprises } from '@/hooks/content/core/useEnterprises';
import useCabinet from '@/hooks/content/useCabinet';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { usePaymentCreateFormStructure } from './usePaymentCreateFormStructure';
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

interface PaymentFormProps {
  className?: string;
  enterpriseId?: string;
}

export const PaymentCreateForm = ({ className, enterpriseId }: PaymentFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const store = usePaymentStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  React.useEffect(() => {
    setRoutes?.(
      !enterpriseId
        ? [
            { title: tCommon('menu.selling'), href: '/selling' },
            { title: tInvoicing('payment.plural'), href: '/selling/payments' },
            { title: tInvoicing('payment.new') }
          ]
        : []
    );
    return () => clearRoutes?.();
  }, [router.locale, enterpriseId]);

  // Fetch options
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { cabinet, isFetchCabinetPending } = useCabinet();

  React.useEffect(() => {
    store.setNested('createDto.currencyId', cabinet?.currency?.id);
  }, [cabinet]);

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['currency', 'invoices', 'invoices.currency'],
    excludeSystem: true
  });

  const currency = React.useMemo(() => {
    return currencies.find((c) => c.id === store.createDto.currencyId);
  }, [store.createDto.currencyId, currencies]);

  const { mutate: createPayment, isPending: isCreatePending } = useMutation({
    mutationFn: (data: { payment: any }) => api.invoicing.payment.create(data.payment),
    onSuccess: () => {
      toast.success('Paiement créé avec succès');
      router.push('/selling/payments');
      store.reset();
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la création de paiement');
      toast.error(message);
    }
  });

  //Reset Form
  const globalReset = () => {
    store.reset();
  };

  React.useEffect(() => {
    globalReset();
  }, []);

  const onSubmit = () => {
    // TODO validation of amounts etc.
    const payment = store.createDto;

    // validation logic from before is omitted here temporarily, assuming valid or you'll handle on backend
    createPayment({
      payment,
    });
  };

  const loading = isEnterprisesPending || isCurrenciesPending || isFetchCabinetPending;

  const { mainFormStructure } = usePaymentCreateFormStructure({
    store,
    enterprises: enterprises || [],
    currencies: currencies.filter(
      (c) => c.id == cabinet?.currencyId || c.id == store.createDto.currencyId
    ),
    loading
  });

  if (loading) {
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
          <Status className="mx-auto" status="New" />
          <Separator />
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs font-bold">Actions</Label>
            <Button
              type="button"
              size="lg"
              className="rounded-xl"
              variant={'outline'}
              disabled={isCreatePending}
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
              disabled={isCreatePending}
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
