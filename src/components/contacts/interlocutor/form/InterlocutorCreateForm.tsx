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
import { CreateInterlocutorDto } from '@/types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { createInterlocutorValidationSchema } from '@/types/validations/interlocutor.validation';

interface InterlocutorCreateFormProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const InterlocutorCreateForm = ({
  className,
  onSuccess,
  onCancel
}: InterlocutorCreateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const interlocutorStore = useInterlocutorStore();
  const { interlocutorInformation } = useInterlocutorCreateFormStructure({
    store: interlocutorStore
  });
  const queryClient = useQueryClient();

  const { mutate: createInterlocutor, isPending } = useMutation({
    mutationFn: (data: CreateInterlocutorDto) => api.core.interlocutor.create(data),
    onSuccess: () => {
      toast.success(tContacts('interlocutor.action_add_success'));
      queryClient.invalidateQueries({ queryKey: ['interlocutors'] });
      interlocutorStore.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage('contacts', error, tContacts('interlocutor.action_add_failure')));
    }
  });

  const handleSubmit = () => {
    const result = createInterlocutorValidationSchema.safeParse(interlocutorStore.createDto);
    if (!result.success) {
      interlocutorStore.setNested('errors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    const payload: CreateInterlocutorDto = {
      ...interlocutorStore.createDto
    };

    createInterlocutor(payload);
  };

  return (
    <div className={cn('flex flex-col gap-2 h-full', className)}>
      <div className="flex-1 overflow-auto">
        <FormBuilder structure={interlocutorInformation} />
      </div>

      <div className="flex gap-2 justify-end mt-auto pt-4 border-t">
        <Button onClick={handleSubmit} disabled={isPending}>
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
