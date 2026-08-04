import React from 'react';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useInterlocutorCreateFormStructure } from './useInterlocutorCreateFormStructure';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { CreateInterlocutorDto, CreateEnterpriseInterlocutorDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { createInterlocutorValidationSchema } from '@/types/validations/interlocutor.validation';

interface InterlocutorCreateFormProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  enterpriseId?: number;
}

export const InterlocutorCreateForm = ({
  className,
  onSuccess,
  onCancel,
  enterpriseId
}: InterlocutorCreateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const interlocutorStore = useInterlocutorStore();
  const { interlocutorInformation, isInterlocutorsPending, hasAvailableInterlocutors } =
    useInterlocutorCreateFormStructure({
    store: interlocutorStore,
    enterpriseId
  });
  const queryClient = useQueryClient();

  const { mutate: createInterlocutor, isPending: isCreateInterlocutorPending } = useMutation({
    mutationFn: (data: CreateInterlocutorDto) => api.core.interlocutor.create(data),
    onSuccess: () => {
      toast.success(tContacts('interlocutor.action_add_success'));
      queryClient.invalidateQueries({ queryKey: ['interlocutors'] });
      if (enterpriseId) {
        queryClient.invalidateQueries({
          queryKey: ['enterprise-available-interlocutors', enterpriseId]
        });
      }
      interlocutorStore.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage('contacts', error, tContacts('interlocutor.action_add_failure')));
    }
  });

  const { mutate: createEnterpriseInterlocutor, isPending: isCreateEnterpriseInterlocutorPending } = useMutation({
    mutationFn: (data: CreateEnterpriseInterlocutorDto) => api.core.enterpriseInterlocutor.create(data),
    onSuccess: () => {
      toast.success(tContacts('interlocutor.action_add_success'));
      queryClient.invalidateQueries({ queryKey: ['interlocutors'] });
      if (enterpriseId) {
        queryClient.invalidateQueries({
          queryKey: ['enterprise-available-interlocutors', enterpriseId]
        });
      }
      interlocutorStore.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage('contacts', error, tContacts('interlocutor.action_add_failure')));
    }
  });

  const isPending = isCreateInterlocutorPending || isCreateEnterpriseInterlocutorPending;
  const isAssociateExisting = !!enterpriseId && !!interlocutorStore.createDto.associateExisting;
  const isSaveDisabled =
    isPending ||
    (isAssociateExisting &&
      (isInterlocutorsPending || !hasAvailableInterlocutors || !interlocutorStore.createDto.interlocutorId));

  const handleSubmit = () => {
    if (!interlocutorStore.createDto.associateExisting) {
      const result = createInterlocutorValidationSchema.safeParse(interlocutorStore.createDto);
      if (!result.success) {
        interlocutorStore.set('errors', result.error.flatten().fieldErrors);
        toast.error(tCommon('errors.validation'));
        return;
      }
    } else {
      if (!interlocutorStore.createDto.interlocutorId) {
        interlocutorStore.set('errors', { interlocutorId: [tCommon('errors.required')] });
        toast.error(tCommon('errors.validation'));
        return;
      }
    }

    if (enterpriseId) {
      const payload: CreateEnterpriseInterlocutorDto = {
        enterpriseId,
        position: interlocutorStore.createDto.position || '',
        main: false,
      };

      if (interlocutorStore.createDto.associateExisting) {
        payload.interlocutorId = interlocutorStore.createDto.interlocutorId;
      } else {
        payload.interlocutor = {
          title: interlocutorStore.createDto.title,
          firstName: interlocutorStore.createDto.firstName,
          lastName: interlocutorStore.createDto.lastName,
          email: interlocutorStore.createDto.email,
          phone: interlocutorStore.createDto.phone,
        };
      }
      createEnterpriseInterlocutor(payload);
    } else {
      const payload: CreateInterlocutorDto = {
        title: interlocutorStore.createDto.title,
        firstName: interlocutorStore.createDto.firstName,
        lastName: interlocutorStore.createDto.lastName,
        email: interlocutorStore.createDto.email,
        phone: interlocutorStore.createDto.phone,
      };
      createInterlocutor(payload);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 h-full', className)}>
      <div className="flex-1 overflow-auto">
        <FormBuilder structure={interlocutorInformation} />
      </div>

      <div className="flex gap-2 justify-end mt-auto pt-4 border-t">
        <Button onClick={handleSubmit} disabled={isSaveDisabled}>
          {tCommon('commands.save')}
          <Spinner show={isPending} />
        </Button>
        <Button variant={'secondary'} onClick={onCancel} disabled={isPending}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    </div>
  );
};
