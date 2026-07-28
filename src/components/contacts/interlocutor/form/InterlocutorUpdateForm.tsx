import React from 'react';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useInterlocutorUpdateFormStructure } from './useInterlocutorUpdateFormStructure';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { UpdateInterlocutorDto, UpdateEnterpriseInterlocutorDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { updateInterlocutorValidationSchema } from '@/types/validations/interlocutor.validation';

interface InterlocutorUpdateFormProps {
  className?: string;
  interlocutorId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  enterpriseId?: number;
}

export const InterlocutorUpdateForm = ({
  className,
  interlocutorId,
  onSuccess,
  onCancel,
  enterpriseId
}: InterlocutorUpdateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const store = useInterlocutorStore();
  const { interlocutorInformation } = useInterlocutorUpdateFormStructure({
    store,
    enterpriseId
  });
  const queryClient = useQueryClient();

  const { isPending: isFetchPending } = useQuery({
    queryKey: ['interlocutor', interlocutorId],
    queryFn: () => api.core.interlocutor.findById(interlocutorId),
    enabled: !!interlocutorId
  });

  const { mutateAsync: updateInterlocutorAsync, isPending: isUpdateInterlocutorPending } =
    useMutation({
      mutationFn: (data: UpdateInterlocutorDto) =>
        api.core.interlocutor.update(interlocutorId, data)
    });

  const {
    mutateAsync: updateEnterpriseInterlocutorAsync,
    isPending: isUpdateEnterpriseInterlocutorPending
  } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEnterpriseInterlocutorDto }) =>
      api.core.enterpriseInterlocutor.update(id, data)
  });

  const isPending = isUpdateInterlocutorPending || isUpdateEnterpriseInterlocutorPending;

  const handleSubmit = async () => {
    const result = updateInterlocutorValidationSchema.safeParse(store.updateDto);
    if (!result.success) {
      store.setNested('errors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    const payload: UpdateInterlocutorDto = {
      title: store.updateDto?.title,
      firstName: store.updateDto?.firstName,
      lastName: store.updateDto?.lastName,
      email: store.updateDto?.email,
      phone: store.updateDto?.phone
    };

    try {
      await updateInterlocutorAsync(payload);

      if (enterpriseId && store.enterpriseInterlocutorId !== undefined) {
        await updateEnterpriseInterlocutorAsync({
          id: store.enterpriseInterlocutorId,
          data: { position: store.updateDto?.position || '' }
        });
      }

      toast.success(tContacts('interlocutor.action_edit_success'));
      queryClient.invalidateQueries({ queryKey: ['interlocutors'] });
      store.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_edit_failure'))
      );
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 h-full', className)}>
      <div className="flex-1 overflow-auto">
        <FormBuilder structure={interlocutorInformation} />
      </div>

      <div className="flex gap-2 justify-end mt-auto pt-4 border-t">
        <Button onClick={handleSubmit} disabled={isPending || isFetchPending}>
          {tCommon('commands.save')}
          <Spinner show={isPending || isFetchPending} />
        </Button>
        <Button variant={'secondary'} onClick={onCancel} disabled={isPending || isFetchPending}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    </div>
  );
};
