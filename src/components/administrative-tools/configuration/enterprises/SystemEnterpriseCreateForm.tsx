import React from 'react';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { usePaymentCondition } from '@/hooks/content/core/usePaymentConditions';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { ResponseRefParamDto, CreateEnterpriseDto } from '@/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useEnterpriseCreateFormStructure } from '@/components/contacts/enterprise/form/useEnterpriseCreateFormStructure';
import { useEnterpriseAddressFormStructure } from '@/components/contacts/enterprise/form/useEnterpriseAddressFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { createEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Separator } from '@/components/ui/separator';
import { defineStepper } from '@/components/ui/stepper';
import { useFooter } from '@/context/FooterContext';

const steps = [
  {
    id: '1',
    title: 'Enterprise information',
    description: 'Basic information about the enterprise.'
  },
  {
    id: '2',
    title: 'Address information',
    description: 'Address information for the enterprise.'
  },
  {
    id: '3',
    title: 'Additional information',
    description: 'Additional information about the enterprise.'
  }
];

const { Stepper } = defineStepper(...steps);

const StepperFooterControls = ({ methods, isPending, handleSubmit, submitLabel }: any) => {
  const { setContent } = useFooter();
  React.useEffect(() => {
    setContent?.(
      <div className="flex items-center justify-end gap-2 px-4 py-1">
        {!methods.isFirst && (
          <Button variant="outline" size="sm" onClick={methods.prev} disabled={isPending}>
            <div className="flex items-center gap-2">
              <ChevronLeft /> <span>Previous</span>
            </div>
          </Button>
        )}
        <Button
          size="sm"
          onClick={methods.isLast ? handleSubmit : methods.next}
          disabled={isPending}>
          {methods.isLast ? (
            <div className="flex items-center gap-2">
              <span>{submitLabel}</span>
              <Save />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Next</span>
              <ChevronRight />
            </div>
          )}
        </Button>
      </div>
    );
  }, [methods.current.id, isPending, handleSubmit, submitLabel, setContent]);
  return null;
};

interface SystemEnterpriseCreateFormProps {
  className?: string;
}

export const SystemEnterpriseCreateForm = ({ className }: SystemEnterpriseCreateFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tCountry } = useTranslation('country');

  const enterpriseStore = useEnterpriseStore();
  const queryClient = useQueryClient();

  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { countries, isFetchCountriesPending } = useCountries();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const { setContent } = useFooter();

  const { enterpriseInformation, additionalInformation } = useEnterpriseCreateFormStructure({
    store: enterpriseStore,
    activityOptions: mapToSelectOptions({
      data: activities,
      labelKey: 'label',
      valueKey: 'id'
    }),
    currencyOptions: mapToSelectOptions({
      data: currencies,
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (label, entity: ResponseRefParamDto<{ symbol: string }>) =>
        `${tCommon(label)} ${entity?.extras?.symbol}`
    }),
    paymentConditionOptions: mapToSelectOptions({
      data: paymentConditions,
      labelKey: 'label',
      valueKey: 'id'
    }),
    countryOptions: mapToSelectOptions({
      data: countries,
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (label) => tCountry(label)
    }),
    interlocutorOptions: []
  });

  const { addressInformation } = useEnterpriseAddressFormStructure({
    store: enterpriseStore,
    countryOptions: mapToSelectOptions({
      data: countries,
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (label) => tCountry(label)
    })
  });

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: 'System Enterprises' },
      { title: 'New System Enterprise' }
    ]);
    return () => {
      setRoutes?.([]);
      setContent?.(null);
      enterpriseStore.reset();
    };
  }, [router.locale]);

  const { mutate: createEnterprise, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateEnterpriseDto) => api.core.enterprise.createSystem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-enterprises'] });
      toast.success('System enterprise created successfully');
      router.back();
    },
    onError: (error): void => {
      const message = getErrorMessage('settings', error, 'Failed to create system enterprise');
      toast.error(message);
    }
  });

  const handleSubmit = React.useCallback(() => {
    const result = createEnterpriseValidationSchema.safeParse(enterpriseStore.createDto);
    if (!result.success) {
      enterpriseStore.set('errors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    const payload = { ...enterpriseStore.createDto };

    const cleanAddress = (address: any) => {
      if (!address) return undefined;
      if (!address.address && !address.region && !address.zipcode && !address.countryId) {
        return undefined;
      }
      return address;
    };

    payload.deliveryAddress = cleanAddress(payload.deliveryAddress);
    payload.invoicingAddress = cleanAddress(payload.invoicingAddress);

    createEnterprise({
      ...payload,
      notes: JSON.stringify(payload.notes)
    });
  }, [enterpriseStore, createEnterprise, tCommon]);

  const loading =
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  if (loading) return <Spinner className="h-screen" show={loading} />;

  return (
    <div className={cn('flex flex-col flex-1', className)}>
      <Stepper.Provider className="flex flex-col flex-1" variant="horizontal">
        {({ methods }) => {
          return (
            <>
              <Stepper.Navigation className="shrink">
                {methods.all.map((step) => (
                  <Stepper.Step key={step.id} of={step.id} onClick={() => methods.goTo(step.id)}>
                    <Stepper.Title>{step.title}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              <div className="flex flex-col flex-1 my-4">
                <div className="flex flex-col flex-1 p-2">
                  <div className="space-y-1 mb-4">
                    <h1 className="text-lg font-bold">{methods.current.title}</h1>
                    <p className="text-xs">{methods.current.description}</p>
                    <Separator className="mt-2" />
                  </div>

                  {methods.current.id === '1' && <FormBuilder structure={enterpriseInformation} />}
                  {methods.current.id === '2' && <FormBuilder structure={addressInformation} />}
                  {methods.current.id === '3' && <FormBuilder structure={additionalInformation} />}
                </div>
              </div>

              <StepperFooterControls
                methods={methods}
                isPending={isCreatePending}
                handleSubmit={handleSubmit}
                submitLabel="Create"
              />
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
};
