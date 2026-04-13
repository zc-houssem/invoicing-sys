import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivities from '@/hooks/content/useActivities';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../../ui/button';
import { Spinner } from '@/components/shared';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { CreateEnterpriseDto } from '@/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { defineStepper } from '@/components/ui/stepper';
import { useEnterpriseCreateFormStructure } from './useEnterpriseCreateFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';

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

interface EnterpriseFormProps {
  className?: string;
}

export const EnterpriseCreateForm = ({ className }: EnterpriseFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');

  // Stores
  const enterpriseStore = useEnterpriseStore();

  const {
    enterpriseInformation,
    addressInformation,
    interlocutorInformation,
    additionalInformation
  } = useEnterpriseCreateFormStructure({
    store: enterpriseStore
  });

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.contacts'), href: '/contacts' },
      { title: tCommon('submenu.enterprises'), href: '/contacts/enterprises' },
      { title: tContact('enterprise.new') }
    ]);
    return () => {
      setRoutes?.([]);
      enterpriseStore.reset();
    };
  }, [router.locale]);

  // Fetch options
  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const loading =
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  //create enterprise mutator
  const { mutate: createEnterprise, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateEnterpriseDto) => api.core.enterprise.create(data),
    onSuccess: () => {
      router.push(`/contacts/enterprises`);
      toast.success(tContact('enterprise.action_add_success'));
    },
    onError: (error): void => {
      const message = getErrorMessage('contacts', error, tContact('enterprise.action_add_failure'));
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

    if (stepId === '2') {
    }

    if (stepId === '3') {
    }

    if (stepId === '4') {
    }
    return true;
  };

  //create handler
  const handleSubmit = () => {
    createEnterprise({
      ...enterpriseStore.createDto,
      notes: JSON.stringify(enterpriseStore.createDto.notes)
    });
  };

  //component representation
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
                      <Card className="flex flex-col flex-1">
                        <CardHeader>
                          <CardTitle>{methods.current.title}</CardTitle>
                          <CardDescription>{methods.current.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                      </Card>
                    </div>
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
                  <Button size="sm" onClick={handleNext} disabled={false}>
                    {methods.isLast ? (
                      <div className="flex items-center gap-2">
                        <span>Create</span>
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
