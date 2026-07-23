import React from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useRoles } from '@/hooks/content/useRoles';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { Button } from '@/components/ui/button';
import { useUpdateUserFormStructure } from './useUpdateUserFormStructure';
import { Repeat2, Save } from 'lucide-react';
import { ServerErrorResponse, UpdateUserDto, Upload } from '@/types';
import { updateUserSchema } from '@/types/validations/user.validation';
import { Spinner } from '@/components/shared/Spinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useFooter } from '@/context/FooterContext';
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';
import { useIdentifiedUser } from '@/hooks/content/user/useIdentifiedUser';
import { useUpload } from '@/hooks/content/useUpload';

interface UserUpdateFormProps {
  userId?: string;
  className?: string;
  onSuccess?: () => void;
}

export const UserUpdateForm = ({ userId, className, onSuccess }: UserUpdateFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      { title: tUser('userManagement.sheet.updateUserTitle') }
    ]);
    setIntro?.(
      tUser('userManagement.sheet.updateUserTitle'),
      tUser('userManagement.sheet.updateUserDescription')
    );
    setEnableMainOverflow?.(true);
    return () => {
      setRoutes?.([]);
      clearIntro?.();
      clearEnableMainOverflow?.();
      userStore.reset();
    };
  }, [router.locale, tCommon, tUser]);

  const { user: fetchedUser, isFetchUserPending } = useIdentifiedUser(
    userId,
    undefined,
    Boolean(userId)
  );

  React.useEffect(() => {
    if (fetchedUser) {
      userStore.set('response', fetchedUser);
      userStore.set<UpdateUserDto>('updateDto', {
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        dateOfBirth: fetchedUser.dateOfBirth,
        isActive: fetchedUser.isActive,
        isApproved: fetchedUser.isApproved,
        username: fetchedUser.username,
        email: fetchedUser.email,
        password: '',
        roleId: fetchedUser.roleId,
        pictureId: fetchedUser?.pictureId
      });
    }
  }, [fetchedUser]);

  const { upload: profilePicture } = useUpload({
    id: userStore.updateDto?.pictureId,
    enabled: Boolean(userStore.updateDto?.pictureId)
  });
  React.useEffect(() => {
    if (profilePicture) {
      userStore.set('picture', profilePicture);
    }
  }, [profilePicture]);

  const { uploadFiles: uploadProfilePicture, isUploadPending: isProfilePictureUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('updateDto.pictureId', response?.[0]?.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const { userUpdateFormStructure } = useUpdateUserFormStructure({
    userStore,
    roles: mapToSelectOptions({
      data: isFetchRolesPending ? [] : roles,
      labelKey: 'label',
      valueKey: 'id'
    }),
    uploadProfilePicture,
    isProfilePictureUploadPending
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.admin.user.update(data.id, data.user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
      });
      toast.success(tUser('userManagement.messages.userUpdatedSuccess'));
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
    if (fetchedUser) {
      userStore.set('updateDtoErrors', {});
      userStore.set('confirmPassword', '');
      userStore.set('setManualPassword', false);
      userStore.set('response', fetchedUser);
      userStore.set<UpdateUserDto>('updateDto', {
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        dateOfBirth: fetchedUser.dateOfBirth,
        isActive: fetchedUser.isActive,
        isApproved: fetchedUser.isApproved,
        username: fetchedUser.username,
        email: fetchedUser.email,
        password: '',
        roleId: fetchedUser.roleId,
        pictureId: fetchedUser?.pictureId
      });
    } else {
      userStore.reset();
    }
  }, [fetchedUser, userStore]);

  const handleSubmit = React.useCallback(() => {
    const userResult = updateUserSchema(userStore.setManualPassword).safeParse({
      ...userStore.updateDto,
      confirmPassword: userStore.confirmPassword
    });

    if (!userResult.success) {
      userStore.set('updateDtoErrors', userResult.error.flatten().fieldErrors);
      console.log('Validation failed', userResult.error.flatten().fieldErrors);
      toast.error('Validation failed: ' + Object.keys(userResult.error.flatten().fieldErrors).join(', '));
      return;
    }
    userStore.set('updateDtoErrors', {});

    updateMutation({ id: userId || userStore.response?.id, user: userStore.updateDto });
  }, [userStore, updateMutation, userId]);

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
      {isFetchRolesPending || isFetchUserPending ? (
        <Spinner />
      ) : (
        <div className="flex flex-col flex-1 my-4">
          <FormBuilder structure={userUpdateFormStructure} />
        </div>
      )}
    </div>
  );
};
