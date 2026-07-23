import React from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useRoles } from '@/hooks/content/useRoles';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { Button } from '@/components/ui/button';
import { useCreateUserFormStructure } from './useCreateUserFormStructure';
import { Repeat2, Save } from 'lucide-react';
import { createUserSchema } from '@/types/validations/user.validation';
import { Spinner } from '@/components/shared/Spinner';
import { CreateUserDto, ServerErrorResponse, Upload } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useFooter } from '@/context/FooterContext';
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';

interface UserCreateFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const UserCreateForm = ({ className, onSuccess }: UserCreateFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');
  const userStore = useUserStore();
  const { roles, isFetchRolesPending } = useRoles();
  const { setRoutes } = useBreadcrumb();
  const { setContent } = useFooter();
  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.administrativeTools.title') || 'Administrative Tools' },
      { title: tUser('userManagement.page.title') },
      {
        title: tUser('userManagement.page.users'),
        href: '/administrative-tools/user-management/users'
      },
      { title: tUser('userManagement.sheet.createUserTitle') }
    ]);
    setIntro?.(
      tUser('userManagement.sheet.createUserTitle'),
      tUser('userManagement.sheet.createUserDescription')
    );
    setEnableMainOverflow?.(true);
    return () => {
      setRoutes?.([]);
      clearIntro?.();
      clearEnableMainOverflow?.();
      userStore.reset();
    };
  }, [router.locale, tCommon, tUser]);

  const { uploadFiles: uploadProfilePicture, isUploadPending: isProfilePictureUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('createDto.pictureId', response?.[0]?.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const { userCreateFormStructure } = useCreateUserFormStructure({
    userStore,
    roles: mapToSelectOptions({
      data: isFetchRolesPending ? [] : roles,
      labelKey: 'label',
      valueKey: 'id'
    }),
    uploadProfilePicture,
    isProfilePictureUploadPending
  });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (user: CreateUserDto) => api.admin.user.create(user),
    onSuccess: () => {
      toast.success(tUser('userManagement.messages.userCreatedSuccess'));
      userStore.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/administrative-tools/user-management/users');
      }
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || tUser('userManagement.errors.generalError'));
    }
  });

  const handleReset = React.useCallback(() => {
    userStore.reset();
  }, [userStore]);

  const handleSubmit = React.useCallback(() => {
    const userResult = createUserSchema.safeParse({
      ...userStore.createDto,
      confirmPassword: userStore.confirmPassword
    });
    if (!userResult.success) {
      userStore.set('createDtoErrors', userResult.error.flatten().fieldErrors);
      return;
    }
    userStore.set('createDtoErrors', {});

    createMutation(userStore.createDto);
  }, [userStore, createMutation]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex items-center justify-end gap-2 px-4 py-1">
        <Button variant="secondary" onClick={handleReset} disabled={isPending}>
          <Repeat2 /> {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          <Save /> {tCommon('commands.save')}
        </Button>
      </div>
    );
    return () => {
      setContent?.(null);
    };
  }, [setContent, handleReset, handleSubmit, isPending, tCommon]);

  return (
    <div className={cn('flex flex-col flex-1 gap-2', className)}>
      {isFetchRolesPending ? (
        <Spinner />
      ) : (
        <div className="flex flex-col flex-1 my-4">
          <FormBuilder structure={userCreateFormStructure} />
        </div>
      )}
    </div>
  );
};
