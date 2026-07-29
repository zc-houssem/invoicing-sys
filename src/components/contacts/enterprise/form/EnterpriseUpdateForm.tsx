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
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';
import { useFooter } from '@/context/FooterContext';
import { useEnterpriseUpdateFormStructure } from './useEnterpriseUpdateFormStructure';
import { useEnterpriseAddressFormStructure } from './useEnterpriseAddressFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Separator } from '@/components/ui/separator';
import { updateEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { UpdateEnterpriseDto } from '@/types/core/enterprise';
import { defineStepper } from '@/components/ui/stepper';

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
        }
      });
    }
    return () => {
      enterpriseStore.reset();
    };
  }, [enterprise]);

  const { enterpriseInformation, interlocutorInformation, additionalInformation } =
    useEnterpriseUpdateFormStructure({
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

  const { addressInformation } = useEnterpriseAddressFormStructure({
    isUpdate: true,
    store: enterpriseStore,
    countryOptions: mapToSelectOptions({
      data: countries,
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (label) => tCountry(label)
    })
  });

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const { setContent } = useFooter();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.contacts.title'), href: '/contacts' },
      { title: tCommon('submenu.enterprises'), href: '/contacts/enterprises' },
      { title: enterprise?.name || tContact('enterprise.edit') }
    ]);

    setIntro?.(
      enterprise?.name || tContact('enterprise.edit'),
      'Update the information for this enterprise.'
    );
    setEnableMainOverflow?.(true);

    return () => {
      setRoutes?.([]);
      clearIntro?.();
      clearEnableMainOverflow?.();
      setContent?.(null);
    };
  }, [router.locale, enterprise?.name, tContact, tCommon]);

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

  //update handler
  const handleSubmit = React.useCallback(() => {
    const result = updateEnterpriseValidationSchema.safeParse(enterpriseStore.updateDto);
    if (!result.success) {
      enterpriseStore.set('errors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    const payload = { ...enterpriseStore.updateDto };

    const cleanAddress = (address: any) => {
      if (!address) return null;
      if (!address.address && !address.region && !address.zipcode && !address.countryId) {
        return null;
      }
      return address;
    };

    payload.deliveryAddress = cleanAddress(payload.deliveryAddress);
    payload.invoicingAddress = cleanAddress(payload.invoicingAddress);

    // Interlocutors are not updated through this form anymore
    delete payload.interlocutors;

    updateEnterprise({
      ...payload,
      notes: JSON.stringify(payload.notes)
    });
  }, [enterpriseStore, updateEnterprise, tCommon]);

  const loading =
    isFetchEnterprisePending ||
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  //component representation
  if (loading || !enterpriseStore.updateDto) return <Spinner className="h-screen" show={true} />;
  return (
    <div className={cn('flex flex-col flex-1', className)}>
      <Stepper.Provider className="flex flex-col flex-1" variant="horizontal">
        {({ methods }) => {
          const activeIndex = steps.findIndex((step) => step.id === methods.current.id);

          return (
            <>
              <Stepper.Navigation className="shrink">
                {methods.all.map((step, index) => (
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
                isPending={isUpdatePending}
                handleSubmit={handleSubmit}
                submitLabel="Save"
              />
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
};
