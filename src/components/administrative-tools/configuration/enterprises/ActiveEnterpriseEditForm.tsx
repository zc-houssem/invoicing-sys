import React from 'react';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { usePaymentCondition } from '@/hooks/content/core/usePaymentConditions';
import { api } from '@/api';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { ResponseRefParamDto, UpdateEnterpriseDto } from '@/types';
import { useEnterpriseUpdateFormStructure } from '@/components/contacts/enterprise/form/useEnterpriseUpdateFormStructure';
import { useEnterpriseLogoUpload } from '@/components/contacts/enterprise/form/useEnterpriseLogoUpload';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { updateEnterpriseValidationSchema } from '@/types/validations/enterprise.validation';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { useFooter } from '@/context/FooterContext';

interface ActiveEnterpriseEditFormProps {
  className?: string;
}

export const ActiveEnterpriseEditForm = ({ className }: ActiveEnterpriseEditFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');
  const { t: tCountry } = useTranslation('country');

  const { setContent, clearContent } = useFooter();
  const { activeCompanyId } = useActiveCompanyContext();
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
  const { logoImage, uploadLogo, isLogoUploadPending } = useEnterpriseLogoUpload(
    enterpriseStore,
    'updateDto'
  );

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
        logoId: enterprise.logoId,
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

  const { enterpriseInformation, additionalInformation } = useEnterpriseUpdateFormStructure({
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
    logoImage,
    uploadLogo,
    isLogoUploadPending
  });

  const queryClient = useQueryClient();

  const { mutate: updateEnterprise, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateEnterpriseDto) => api.core.enterprise.update(activeCompanyId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise', activeCompanyId] });
      queryClient.invalidateQueries({ queryKey: ['system-enterprises'] });
      queryClient.invalidateQueries({ queryKey: ['enterprises'] });
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

    delete (payload as any).interlocutors;

    updateEnterprise({
      ...payload,
      notes: JSON.stringify(payload.notes)
    });
  }, [enterpriseStore, tCommon, updateEnterprise]);

  const loading =
    isFetchEnterprisePending ||
    isFetchActivitiesPending ||
    isCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending;

  const handleReset = React.useCallback(() => {
    refetchEnterprise();
  }, [refetchEnterprise]);

  React.useEffect(() => {
    if (loading || !enterpriseStore.updateDto) {
      clearContent?.();
      return;
    }

    setContent?.(
      <div className="flex justify-end w-full gap-2">
        <Button onClick={handleSubmit} disabled={isUpdatePending}>
          {tCommon('commands.save')}
          {isUpdatePending && <Spinner show />}
        </Button>
        <Button variant="secondary" onClick={handleReset} disabled={isUpdatePending}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    );

    return () => {
      clearContent?.();
    };
  }, [
    loading,
    enterpriseStore.updateDto,
    isUpdatePending,
    handleSubmit,
    handleReset,
    tCommon,
    setContent,
    clearContent
  ]);

  if (!activeCompanyId) {
    return (
      <div className={cn('flex flex-col items-center justify-center flex-1 h-full m-5', className)}>
        <p className="text-lg text-muted-foreground">
          No active enterprise selected. Please select an enterprise to edit.
        </p>
      </div>
    );
  }

  if (loading || !enterpriseStore.updateDto) return <Spinner className="h-screen" show={true} />;

  return (
    <div className={cn('flex flex-col flex-1', className)}>
      <div className={cn('flex flex-col flex-1')}>
        <div className="flex flex-col flex-1 h-full my-4">
          <div className="flex flex-col flex-1 gap-8">
            <FormBuilder structure={enterpriseInformation} />
            <FormBuilder structure={additionalInformation} />
          </div>
        </div>
      </div>
    </div>
  );
};
