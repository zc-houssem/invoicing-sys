import React from 'react';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { Button } from '../../../ui/button';
import { Spinner } from '@/components/shared';
import { usePaymentCondition } from '@/hooks/content/core/usePaymentConditions';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { ResponseRefParamDto } from '@/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { defineStepper } from '@/components/ui/stepper';
import { useEnterpriseUpdateFormStructure } from './useEnterpriseUpdateFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Separator } from '@/components/ui/separator';
import { updateEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { UpdateEnterpriseDto } from '@/types/core/enterprise';

const steps = [
  {
    id: '1',
    title: 'Enterprise information',
    description: 'Basic information about the enterprise.'
  },
  {
    id: '2',
    title: 'Interlocutor information',
    description: 'Information about the main contact person for the enterprise.'
  },
  {
    id: '3',
    title: 'Address information',
    description: 'Invoicing and shipping addresses for the enterprise.'
  },
  {
    id: '4',
    title: 'Additional information',
    description: 'Additional information about the enterprise.'
  }
];

const { Stepper } = defineStepper(...steps);

interface EnterpriseUpdateFormProps {
  enterpriseId: number;
  className?: string;
}

export const EnterpriseUpdateForm = ({ enterpriseId, className }: EnterpriseUpdateFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');
  const { t: tCountry } = useTranslation('country');

  // Stores
  const enterpriseStore = useEnterpriseStore();

  // Fetch enterprise data
  const {
    data: enterprise,
    isPending: isFetchEnterprisePending,
    refetch: refetchEnterprise
  } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () =>
      api.core.enterprise.findById(
        enterpriseId,
        ['interlocutors', 'deliveryAddress', 'invoicingAddress'].join(',')
      ),
    enabled: !!enterpriseId
  });

  // Fetch options
  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { countries, isFetchCountriesPending } = useCountries();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

  // Populate store with fetched enterprise data
  React.useEffect(() => {
    if (enterprise) {
      enterpriseStore.set('response', enterprise);
      enterpriseStore.set('updateDto', {
        name: enterprise.name,
        phone: enterprise.phone,
        website: enterprise.website || '',
        particular: enterprise.particular,
        taxId: enterprise.taxId || '',
        notes: (() => {
          try {
            return enterprise.notes ? JSON.parse(enterprise.notes) : '';
          } catch {
            return enterprise.notes || '';
          }
        })(),
        system: enterprise.system,
        activityId: enterprise.activityId,
        currencyId: enterprise.currencyId,
        paymentConditionId: enterprise.paymentConditionId,
        deliveryAddress: {
          address: enterprise.deliveryAddress?.address || '',
          address2: enterprise.deliveryAddress?.address2 || '',
          region: enterprise.deliveryAddress?.region || '',
          zipcode: enterprise.deliveryAddress?.zipcode,
          countryId: enterprise.deliveryAddress?.countryId
        },
        invoicingAddress: {
          address: enterprise.invoicingAddress?.address || '',
          address2: enterprise.invoicingAddress?.address2 || '',
          region: enterprise.invoicingAddress?.region || '',
          zipcode: enterprise.invoicingAddress?.zipcode,
          countryId: enterprise.invoicingAddress?.countryId
        },
        interlocutors:
          (enterprise as any).interlocutors?.map((ei: any) => ({
            interlocutor: {
              title: ei.interlocutor?.title || '',
              firstName: ei.interlocutor?.firstName || '',
              lastName: ei.interlocutor?.lastName || '',
              email: ei.interlocutor?.email || '',
              phone: ei.interlocutor?.phone || ''
            },
            main: ei.main ?? false,
            position: ei.position || ''
          })) || []
      });
    }
    return () => {
      enterpriseStore.reset();
    };
  }, [enterprise]);

  const {
    enterpriseInformation,
    addressInformation,
    interlocutorInformation,
    additionalInformation
  } = useEnterpriseUpdateFormStructure({
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

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.contacts'), href: '/contacts' },
      { title: tCommon('submenu.enterprises'), href: '/contacts/enterprises' },
      { title: enterprise?.name || tContact('enterprise.edit') }
    ]);
    return () => {
      setRoutes?.([]);
    };
  }, [router.locale, enterprise?.name]);

  //update enterprise mutator
  const { mutate: updateEnterprise, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateEnterpriseDto) => api.core.enterprise.update(enterpriseId, data),
    onSuccess: () => {
      refetchEnterprise();
      toast.success(tContact('enterprise.action_edit_success'));
    },
    onError: (error): void => {
      const message = getErrorMessage(
        'contacts',
        error,
        tContact('enterprise.action_edit_failure')
      );
      toast.error(message);
    }
  });

  const validateStep = (stepId: string) => {
    if (stepId === '1') {
      const result = updateEnterpriseValidationSchema.safeParse(enterpriseStore.updateDto);
      if (!result.success) {
        enterpriseStore.set('errors', result.error.flatten().fieldErrors);
      }
      return result.success;
    }

    if (stepId === '2') {
    }

    if (stepId === '3') {
    }

    if (stepId === '4') {
    }
    return true;
  };

  //update handler
  const handleSubmit = () => {
    updateEnterprise({
      ...enterpriseStore.updateDto,
      notes: JSON.stringify(enterpriseStore.updateDto?.notes)
    });
  };

  const loading =
    isFetchEnterprisePending ||
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  //component representation
  if (loading || !enterpriseStore.updateDto) return <Spinner className="h-screen" show={true} />;
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
                {/* Navigation */}
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

                {/* Content */}
                {false ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-col flex-1 h-full overflow-hidden my-4">
                    <div className="flex flex-col flex-1 overflow-auto p-2">
                      <div className="space-y-1 mb-4">
                        <h1 className="text-lg font-bold">{methods.current.title}</h1>
                        <p className="text-xs">{methods.current.description}</p>
                        <Separator className="mt-2" />
                      </div>
                      <div className="my-auto">
                        {methods.current.id === '1' && (
                          <FormBuilder structure={enterpriseInformation} />
                        )}
                        {methods.current.id === '2' && (
                          <div>
                            <FormBuilder structure={interlocutorInformation} />
                          </div>
                        )}
                        {methods.current.id === '3' && (
                          <div>
                            <FormBuilder structure={addressInformation} />
                          </div>
                        )}
                        {methods.current.id === '4' && (
                          <div>
                            <FormBuilder structure={additionalInformation} />
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                )}

                {/* Controls */}
                <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4">
                  {!methods.isFirst && (
                    <Button variant="outline" size="sm" onClick={methods.prev} disabled={false}>
                      <div className="flex items-center gap-2">
                        <ChevronLeft /> <span>Previous</span>
                      </div>
                    </Button>
                  )}
                  <Button size="sm" onClick={handleNext} disabled={isUpdatePending}>
                    {methods.isLast ? (
                      <div className="flex items-center gap-2">
                        <span>Save</span>
                        <Save />
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
