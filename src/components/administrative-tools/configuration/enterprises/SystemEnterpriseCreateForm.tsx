import React from 'react';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { usePaymentCondition } from '@/hooks/content/core/usePaymentConditions';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { ResponseRefParamDto, CreateEnterpriseDto } from '@/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { defineStepper } from '@/components/ui/stepper';
import { useEnterpriseCreateFormStructure } from '@/components/contacts/enterprise/form/useEnterpriseCreateFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { createEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Separator } from '@/components/ui/separator';

const steps = [
  {
    id: '1',
    title: 'Enterprise information',
    description: 'Basic information about the enterprise.'
  },
  {
    id: '2',
    title: 'Address information',
    description: 'Invoicing and shipping addresses for the enterprise.'
  },
  {
    id: '3',
    title: 'Additional information',
    description: 'Additional information about the enterprise.'
  }
];

const { Stepper } = defineStepper(...steps);

interface SystemEnterpriseCreateFormProps {
  className?: string;
}

export const SystemEnterpriseCreateForm = ({ className }: SystemEnterpriseCreateFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');
  const { t: tCountry } = useTranslation('country');

  const enterpriseStore = useEnterpriseStore();

  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { countries, isFetchCountriesPending } = useCountries();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

  const {
    enterpriseInformation,
    addressInformation,
    additionalInformation
  } = useEnterpriseCreateFormStructure({
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
      enterpriseStore.reset();
    };
  }, [router.locale]);

  const { mutate: createEnterprise, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateEnterpriseDto) => api.core.enterprise.createSystem(data),
    onSuccess: () => {
      toast.success('System enterprise created successfully');
      router.back();
    },
    onError: (error): void => {
      const message = getErrorMessage('settings', error, 'Failed to create system enterprise');
      toast.error(message);
    }
  });

  const validateStep = (stepId: string) => {
    if (stepId === '1') {
      const result = createEnterpriseValidationSchema.safeParse(enterpriseStore.createDto);
      if (!result.success) {
        enterpriseStore.set('errors', result.error.flatten().fieldErrors);
      }
      return result.success;
    }
    return true;
  };

  const handleSubmit = () => {
    createEnterprise({
      ...enterpriseStore.createDto,
      notes: JSON.stringify(enterpriseStore.createDto.notes)
    });
  };

  const loading =
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  if (loading) return <Spinner className="h-screen" show={loading} />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden m-5 lg:mx-10', className)}>
      <div className={cn('flex flex-col flex-1 overflow-hidden')}>
        <Stepper.Provider className="flex flex-col flex-1 overflow-hidden" variant="horizontal">
          {({ methods }) => {
            const activeIndex = steps.findIndex((step) => step.id === methods.current.id);

            const handleNext = () => {
              const valid = validateStep(methods.current.id);
              if (!valid) return;

              if (methods.isLast) {
                handleSubmit();
              } else {
                methods.next();
              }
            };

            return (
              <>
                <Stepper.Navigation className="shrink">
                  {methods.all.map((step, index) => (
                    <Stepper.Step
                      key={step.id}
                      of={step.id}
                      onClick={() => {
                        if (index > activeIndex) {
                          let valid = true;
                          for (let i = 0; i <= activeIndex; i++) {
                            valid = valid && validateStep(steps[i].id);
                          }
                          if (!valid) return;
                        }
                        methods.goTo(step.id);
                      }}
                      disabled={false}>
                      <Stepper.Title>{step.title}</Stepper.Title>
                    </Stepper.Step>
                  ))}
                </Stepper.Navigation>

                <div className="flex flex-col flex-1 h-full overflow-hidden my-4">
                  <div className="flex flex-col flex-1 overflow-auto p-2">
                    <div className="space-y-1 mb-4">
                      <h1 className="text-lg font-bold">{methods.current.title}</h1>
                      <p className="text-xs">{methods.current.description}</p>
                      <Separator className="mt-2" />
                    </div>
                    <div className="my-auto">
                      {methods.current.id === '1' && <FormBuilder structure={enterpriseInformation} />}
                      {methods.current.id === '2' && <div><FormBuilder structure={addressInformation} /></div>}
                      {methods.current.id === '3' && <div><FormBuilder structure={additionalInformation} /></div>}
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>

                <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4">
                  {!methods.isFirst && (
                    <Button variant="outline" size="sm" onClick={methods.prev} disabled={isCreatePending}>
                      <div className="flex items-center gap-2">
                        <ChevronLeft /> <span>Previous</span>
                      </div>
                    </Button>
                  )}
                  <Button size="sm" onClick={handleNext} disabled={isCreatePending}>
                    {methods.isLast ? (
                      <div className="flex items-center gap-2">
                        <span>Create</span>
                        <Save />
                        <Spinner className="ml-2" size="small" show={isCreatePending} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Next</span>
                        <ChevronRight />
                      </div>
                    )}
                  </Button>
                </Stepper.Controls>
              </>
            );
          }}
        </Stepper.Provider>
      </div>
    </div>
  );
};
