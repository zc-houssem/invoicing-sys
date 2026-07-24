import React from 'react';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { Button } from '@/components/ui/button';
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
import { ResponseRefParamDto, UpdateEnterpriseDto } from '@/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { defineStepper } from '@/components/ui/stepper';
import { useEnterpriseUpdateFormStructure } from '@/components/contacts/enterprise/form/useEnterpriseUpdateFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Separator } from '@/components/ui/separator';
import { updateEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useActiveCompanyStore } from '@/hooks/stores/useActiveCompanyStore';

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

interface ActiveEnterpriseEditFormProps {
  className?: string;
}

export const ActiveEnterpriseEditForm = ({ className }: ActiveEnterpriseEditFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');
  const { t: tCountry } = useTranslation('country');

  const { activeCompanyId } = useActiveCompanyStore();
  const enterpriseStore = useEnterpriseStore();

  const {
    data: enterprise,
    isPending: isFetchEnterprisePending,
    refetch: refetchEnterprise
  } = useQuery({
    queryKey: ['enterprise', activeCompanyId],
    queryFn: () =>
      api.core.enterprise.findById(
        activeCompanyId!,
        ['interlocutors', 'deliveryAddress', 'invoicingAddress'].join(',')
      ),
    enabled: !!activeCompanyId
  });

  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { countries, isFetchCountriesPending } = useCountries();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

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

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: 'System Enterprises' },
      { title: enterprise?.name || 'Edit Active Enterprise' }
    ]);
    return () => {
      setRoutes?.([]);
    };
  }, [router.locale, enterprise?.name]);

  const { mutate: updateEnterprise, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateEnterpriseDto) => api.core.enterprise.update(activeCompanyId!, data),
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
    return true;
  };

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

  if (!activeCompanyId) {
    return (
      <div className={cn('flex flex-col items-center justify-center flex-1 h-full m-5', className)}>
        <p className="text-lg text-muted-foreground">No active enterprise selected. Please select an enterprise to edit.</p>
      </div>
    );
  }

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
                      {methods.current.id === '1' && (
                        <FormBuilder structure={enterpriseInformation} />
                      )}
                      {methods.current.id === '2' && (
                        <div>
                          <FormBuilder structure={addressInformation} />
                        </div>
                      )}
                      {methods.current.id === '3' && (
                        <div>
                          <FormBuilder structure={additionalInformation} />
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>

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
