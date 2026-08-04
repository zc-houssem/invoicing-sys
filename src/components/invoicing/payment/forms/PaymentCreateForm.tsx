import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import { useEnterprises } from '@/hooks/content/core/useEnterprises';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { usePaymentCreateFormStructure } from './usePaymentCreateFormStructure';
import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useInvoicingFormScroll } from '@/components/invoicing-commons/useInvoicingFormScroll';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Spinner } from '@/components/shared';
import { DocumentMetaTable } from '../../DocumentMetaTable';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Repeat2 } from 'lucide-react';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import { useSequence } from '@/hooks/useSequence';
import { Sequences } from '@/types/sequence';

interface PaymentFormProps {
  className?: string;
  enterpriseId?: string;
}

export const PaymentCreateForm = ({ className, enterpriseId }: PaymentFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const store = usePaymentStore();
  const { activeCompanyId } = useActiveCompanyContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useSequence(activeCompanyId, Sequences.PAYMENT, (preview: string) =>
    store.set('sequencePreview', preview)
  );

  React.useEffect(() => {
    setRoutes?.(
      !enterpriseId
        ? [
            { title: tCommon('menu.selling.title'), href: '/selling' },
            { title: tInvoicing('payment.plural'), href: '/selling/payments' },
            { title: tInvoicing('payment.new') }
          ]
        : []
    );
    return () => clearRoutes?.();
  }, [router.locale, enterpriseId]);

  // Fetch options
  const { currencies, isCurrenciesPending } = useCurrencies();

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['currency', 'invoices', 'invoices.currency'],
    excludeSystem: true
  });

  const loading = isEnterprisesPending || isCurrenciesPending;
  const isFormReady = !loading;
  useInvoicingFormScroll(isFormReady);

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

  const globalReset = React.useCallback(() => {
    store.reset();
    if (enterpriseId) {
      const entIdNum = parseInt(enterpriseId);
      if (!isNaN(entIdNum)) {
        store.setNested('createDto.enterpriseId', entIdNum);
      }
    }
  }, [enterpriseId]);

  React.useEffect(() => {
    globalReset();
    return () => {
      store.reset();
    };
  }, [enterpriseId, globalReset]);

  const onSubmit = () => {
    // TODO validation of amounts etc.
    const payment = {
      ...store.createDto,
      systemEnterpriseId: activeCompanyId ?? undefined
    };

    // validation logic from before is omitted here temporarily, assuming valid or you'll handle on backend
    createPayment({
      payment
    });
  };

  const { mainFormStructure } = usePaymentCreateFormStructure({
    store,
    enterprises: enterprises || [],
    currencies: mapToSelectOptions({
      data: currencies || [],
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseRefParamDto<CurrencyPayload>) =>
        `${tCurrency(item.label)} (${item.extras.symbol})`
    }),
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
          <DocumentMetaTable className="mx-auto" rows={[{ label: 'Status', value: 'New' }]} />
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
