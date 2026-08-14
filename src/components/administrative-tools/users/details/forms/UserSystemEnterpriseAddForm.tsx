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
import { useUserSystemEnterpriseAddFormStructure } from './useUserSystemEnterpriseAddFormStructure';
import { createUserSystemEnterpriseMemberSchema } from '@/types/validations/enterprise-member.validation';
import { cn } from '@/lib/utils';

interface UserSystemEnterpriseAddFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserSystemEnterpriseAddForm = ({
  userId,
  onSuccess,
  onCancel
}: UserSystemEnterpriseAddFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');
  const createDto = useEnterpriseMemberStore((state) => state.createDto);
  const set = useEnterpriseMemberStore((state) => state.set);
  const reset = useEnterpriseMemberStore((state) => state.reset);
  const setNested = useEnterpriseMemberStore((state) => state.setNested);

  React.useEffect(() => {
    if (createDto.userId !== userId) {
      setNested('createDto.userId', userId);
    }
  }, [userId, createDto.userId, setNested]);

  const { structure, isEnterprisesPending, hasAvailableEnterprises } =
    useUserSystemEnterpriseAddFormStructure({ userId });

  const { mutate: createMember, isPending: isCreatePending } = useMutation({
    mutationFn: () =>
      api.core.enterpriseMember.create({
        ...createDto,
        userId
      }),
    onSuccess: () => {
      toast.success(tUser('userManagement.details.systemEnterprises.messages.addSuccess'));
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          'user-management',
          error,
          tUser('userManagement.details.systemEnterprises.messages.addFailure')
        )
      );
    }
  });

  const handleSubmit = () => {
    const result = createUserSystemEnterpriseMemberSchema.safeParse({
      ...createDto,
      userId
    });
    if (!result.success) {
      set('createDtoErrors', result.error.flatten().fieldErrors);
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
          disabled={
            !createDto.enterpriseId ||
            isCreatePending ||
            isEnterprisesPending ||
            !hasAvailableEnterprises
          }>
          {tCommon('commands.save')}
          <Spinner show={isCreatePending} />
        </Button>
      </div>
    </div>
  );
};
