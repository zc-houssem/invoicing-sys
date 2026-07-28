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
import { UpdateInterlocutorDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { updateInterlocutorValidationSchema } from '@/types/validations/interlocutor.validation';

interface InterlocutorUpdateFormProps {
  className?: string;
  interlocutorId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const InterlocutorUpdateForm = ({
  className,
  interlocutorId,
  onSuccess,
  onCancel
}: InterlocutorUpdateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { interlocutorInformation } = useInterlocutorUpdateFormStructure({
    store: useInterlocutorStore()
  });
  const store = useInterlocutorStore();
  const queryClient = useQueryClient();

  const { isPending: isFetchPending } = useQuery({
    queryKey: ['interlocutor', interlocutorId],
    queryFn: () => api.core.interlocutor.findById(interlocutorId),
    enabled: !!interlocutorId
  });

  const { mutate: updateInterlocutor, isPending } = useMutation({
    mutationFn: (data: UpdateInterlocutorDto) => api.core.interlocutor.update(interlocutorId, data),
    onSuccess: () => {
      toast.success(tContacts('interlocutor.action_edit_success'));
      queryClient.invalidateQueries({ queryKey: ['interlocutors'] });
      store.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_edit_failure'))
      );
    }
  });

  const handleSubmit = () => {
    const result = updateInterlocutorValidationSchema.safeParse(store.updateDto);
    if (!result.success) {
      store.setNested('errors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    const payload: UpdateInterlocutorDto = {
      ...store.updateDto
    };

    updateInterlocutor(payload);
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
