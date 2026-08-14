import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Repeat2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useFooter } from '@/context/FooterContext';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useCurrentUser } from '@/hooks/content/user/useCurrentUser';
import { useUpload } from '@/hooks/useUpload';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { profileUpdateSchema } from '@/types/validations/user.validation';
import { ServerErrorResponse, UpdateUserDto, Upload } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { useProfileFormStructure } from './useProfileFormStructure';

interface ProfilePortalProps {
  className?: string;
}

export const ProfilePortal = ({ className }: ProfilePortalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const pictureId = useUserStore((state) => state.updateDto?.pictureId);
  const pendingFile = useUserStore((state) =>
    state.picture instanceof File ? state.picture : null
  );
  const { user, isUserPending } = useCurrentUser();
  const { url: serverPictureUrl } = useUpload({ uploadId: pictureId });
  const profileImage = pendingFile ?? serverPictureUrl ?? null;
  const { setRoutes } = useBreadcrumb();
  const { setContent, clearContent } = useFooter();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings.title') },
      { title: tCommon('menu.account.title') },
      { title: tCommon('settings.account.my_profile') }
    ]);
    return () => {
      setRoutes?.([]);
    };
  }, [router.locale, setRoutes, tCommon]);

  React.useEffect(() => {
    return () => {
      useUserStore.getState().reset();
    };
  }, []);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const store = useUserStore.getState();
    store.set('response', user);
    store.set<UpdateUserDto>('updateDto', {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      username: user.username,
      email: user.email,
      password: '',
      pictureId: user.pictureId
    });
  }, [user]);

  const { uploadFiles: uploadProfilePicture, isUploadPending: isProfilePictureUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        const newPictureId = response?.[0]?.id;
        const store = useUserStore.getState();
        store.setNested('updateDto.pictureId', newPictureId);
        if (newPictureId) {
          queryClient.invalidateQueries({ queryKey: ['upload', newPictureId] });
        }
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const userStore = useUserStore();

  const { profileFormStructure } = useProfileFormStructure({
    userStore,
    profileImage,
    uploadProfilePicture,
    isProfilePictureUploadPending
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: UpdateUserDto) => api.currentUser.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      if (variables.pictureId) {
        queryClient.invalidateQueries({ queryKey: ['upload', variables.pictureId] });
      }
      useUserStore.getState().set('picture', undefined);
      toast.success(tSettings('account.update_success'));
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('account.update_failure')));
    }
  });

  const handleReset = React.useCallback(() => {
    if (!user) {
      useUserStore.getState().reset();
      return;
    }

    const store = useUserStore.getState();
    store.set('updateDtoErrors', {});
    store.set('confirmPassword', '');
    store.set('setManualPassword', false);
    store.set('response', user);
    store.set<UpdateUserDto>('updateDto', {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      username: user.username,
      email: user.email,
      password: '',
      pictureId: user.pictureId
    });
    store.set('picture', undefined);
    if (user.pictureId) {
      queryClient.invalidateQueries({ queryKey: ['upload', user.pictureId] });
    }
  }, [user, queryClient]);

  const handleSubmit = React.useCallback(() => {
    const store = useUserStore.getState();
    const userResult = profileUpdateSchema(store.setManualPassword).safeParse({
      ...store.updateDto,
      confirmPassword: store.confirmPassword
    });

    if (!userResult.success) {
      store.set('updateDtoErrors', userResult.error.flatten().fieldErrors);
      toast.error(tCommon('errors.validation'));
      return;
    }

    store.set('updateDtoErrors', {});
    updateProfile(store.updateDto);
  }, [updateProfile, tCommon]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex items-center justify-end gap-2 px-4 py-1">
        <Button variant="secondary" onClick={handleReset} disabled={isPending}>
          <Repeat2 /> {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isPending || isUserPending}>
          <Save /> {tCommon('commands.save')}
          {isPending && <Spinner show />}
        </Button>
      </div>
    );
    return () => clearContent?.();
  }, [
    setContent,
    clearContent,
    handleReset,
    handleSubmit,
    isPending,
    isUserPending,
    tCommon
  ]);

  return (
    <div className={cn('flex flex-col flex-1 gap-2', className)}>
      {isUserPending ? (
        <Spinner />
      ) : (
        <div className="flex flex-col flex-1 my-4">
          <FormBuilder structure={profileFormStructure} />
        </div>
      )}
    </div>
  );
};
