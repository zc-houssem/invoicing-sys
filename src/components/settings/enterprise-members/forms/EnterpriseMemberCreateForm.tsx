import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { Separator } from '@/components/ui/separator';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useEnterpriseMemberStore } from '@/hooks/stores/useEnterpriseMemberStore';
import { useEnterpriseMemberCreateFormStructure } from './useEnterpriseMemberCreateFormStructure';
import { createEnterpriseMemberSchema } from '@/types/validations/enterprise-member.validation';
import { cn } from '@/lib/utils';

interface EnterpriseMemberCreateFormProps {
  enterpriseId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EnterpriseMemberCreateForm = ({
  enterpriseId,
  onSuccess,
  onCancel
}: EnterpriseMemberCreateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const memberStore = useEnterpriseMemberStore();

  const { structure, isUsersPending, hasAvailableUsers } =
    useEnterpriseMemberCreateFormStructure({
      store: memberStore,
      enterpriseId
    });

  const { mutate: createMember, isPending: isCreatePending } = useMutation({
    mutationFn: () =>
      api.core.enterpriseMember.create({
        ...memberStore.createDto,
        enterpriseId
      }),
    onSuccess: () => {
      toast.success(tSettings('members.messages.addSuccess'));
      memberStore.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage('settings', error, tSettings('members.messages.addFailure')));
    }
  });

  const handleSubmit = () => {
    const result = createEnterpriseMemberSchema.safeParse(memberStore.createDto);
    if (!result.success) {
      memberStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }
    createMember();
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden')}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex justify-end gap-2 px-2 pb-2">
        <Button variant="secondary" onClick={onCancel}>
          {tCommon('commands.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!memberStore.createDto.userId || isCreatePending || isUsersPending || !hasAvailableUsers}>
          {tCommon('commands.save')}
          <Spinner show={isCreatePending} />
        </Button>
      </div>
    </div>
  );
};
