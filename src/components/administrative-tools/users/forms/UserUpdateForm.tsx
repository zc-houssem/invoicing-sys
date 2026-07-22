import React from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useRoles } from '@/hooks/content/useRoles';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { Button } from '@/components/ui/button';
import { useUpdateUserFormStructure } from './useUpdateUserFormStructure';
import { Save } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useIdentifiedUser } from '@/hooks/content/user/useIdentifiedUser';
import { useUploads } from '@/hooks/content/useUploads';
import { useUpload } from '@/hooks/content/useUpload';
import { Gender } from '@/types';



interface UserUpdateFormProps {
  userId?: string;
  className?: string;
  updateUser?: (user: UpdateUserDto) => void;
  isUpdatePending?: boolean;
}

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({
  userId,
  className,
  updateUser,
  isUpdatePending
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');
  const userStore = useUserStore();
  const { roles, isFetchRolesPending } = useRoles();
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.administrativeTools') || 'Administrative Tools' },
      { title: tUser('userManagement.page.title') },
      { title: tUser('userManagement.page.users'), href: '/administrative-tools/user-management/users' },
      { title: tUser('userManagement.sheet.updateUserTitle') }
    ]);
    return () => {
      setRoutes?.([]);
      userStore.reset();
    };
  }, [router.locale]);

  const { user: fetchedUser, isFetchUserPending } = useIdentifiedUser(userId, undefined, Boolean(userId));

  React.useEffect(() => {
    if (fetchedUser) {
      const uploads = fetchedUser?.uploads?.sort((a, b) => a.order - b.order) || [];
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
        phone: fetchedUser?.phone,
        pictureId: fetchedUser?.pictureId,
        cin: fetchedUser?.cin,
        bio: fetchedUser?.bio,
        gender: fetchedUser?.gender as Gender,
        isPrivate: fetchedUser?.isPrivate,
        officialDocumentId: fetchedUser?.officialDocumentId,
        driverLicenseDocumentId: fetchedUser?.driverLicenseDocumentId,
        uploads: uploads.map((upload) => ({
          id: upload.id,
          uploadId: upload.uploadId
        }))
      });
    }
  }, [fetchedUser]);

  const uploadIds = React.useMemo(() => {
    return Array.isArray(userStore.updateDto?.uploads)
      ? userStore.updateDto.uploads.map((u) => u.uploadId)
      : [];
  }, [userStore.updateDto?.uploads]);

  const { uploads: images } = useUploads(uploadIds);

  React.useEffect(() => {
    if (images.length > 0 && !userStore.hasInitializedImages && userStore.images.length === 0) {
      userStore.set('images', images);
      userStore.set('hasInitializedImages', true);
    }
  }, [images, userStore.hasInitializedImages]);

  const { upload: profilePicture } = useUpload({
    id: userStore.updateDto?.pictureId,
    enabled: Boolean(userStore.updateDto?.pictureId)
  });
  React.useEffect(() => {
    if (profilePicture) {
      userStore.set('picture', profilePicture);
    }
  }, [profilePicture]);

  const { upload: officialDocument } = useUpload({
    id: userStore.updateDto?.officialDocumentId,
    enabled: Boolean(userStore.updateDto?.officialDocumentId)
  });
  React.useEffect(() => {
    if (officialDocument) {
      userStore.set('officialDocument', officialDocument);
    }
  }, [officialDocument]);

  const { upload: driverLicenseDocument } = useUpload({
    id: userStore.updateDto?.driverLicenseDocumentId,
    enabled: Boolean(userStore.updateDto?.driverLicenseDocumentId)
  });
  React.useEffect(() => {
    if (driverLicenseDocument) {
      userStore.set('driverLicenseDocument', driverLicenseDocument);
    }
  }, [driverLicenseDocument]);

  const { uploadFiles: uploadProfilePicture, isUploadPending: isProfilePictureUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('updateDto.pictureId', response?.[0]?.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const { uploadFiles: uploadOfficialDocument, isUploadPending: isOfficialDocumentUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('updateDto.officialDocumentId', response?.[0]?.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const {
    uploadFiles: uploadDriverLicenseDocument,
    isUploadPending: isDriverLicenseDocumentPending
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested('updateDto.driverLicenseDocumentId', response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    }
  });

  const { uploadFiles: uploadPhotos, isUploadPending: isPhotosUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.appendUploadId('update', { uploadId: response?.[0]?.id as number });
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
    isProfilePictureUploadPending,

    uploadOfficialDocument,
    isOfficialDocumentUploadPending,

    uploadDriverLicenseDocument,
    isDriverLicenseDocumentPending,

    uploadPhotos,
    isPhotosUploadPending
  });

  const { mutate: updateMutation, isPending: isMutationPending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.admin.user.update(data.id, data.user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
      });
      toast.success(tUser('userManagement.messages.userUpdatedSuccess'));
      userStore.reset();
      router.push('/administrative-tools/user-management/users');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || tUser('userManagement.errors.generalError'));
    }
  });

  const isPending = isUpdatePending ?? isMutationPending;

  const handleSubmit = () => {
    const userResult = updateUserSchema(userStore.setManualPassword).safeParse({
      ...userStore.updateDto,
      confirmPassword: userStore.confirmPassword
    });

    if (!userResult.success) {
      userStore.set('updateDtoErrors', userResult.error.flatten().fieldErrors);
      return;
    }
    userStore.set('updateDtoErrors', {});

    if (updateUser) {
      updateUser(userStore.updateDto);
    } else {
      updateMutation({ id: userId || userStore.response?.id, user: userStore.updateDto });
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden gap-2 m-5 lg:mx-10', className)}>
      {isFetchRolesPending || isFetchUserPending ? (
        <Spinner />
      ) : (
        <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden my-4">
          <div className="flex flex-col flex-1 overflow-auto p-2">
            <div className="space-y-1 mb-4">
              <h1 className="text-lg font-bold">{tUser('userManagement.forms.step1Title')}</h1>
              <p className="text-xs text-muted-foreground">{tUser('userManagement.forms.step1Description')}</p>
              <Separator className="mt-2" />
            </div>
            <div className="my-auto">
              <FormBuilder structure={userUpdateFormStructure} />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
        <Button onClick={handleSubmit} disabled={isPending}>
          <Save /> {tCommon('common.buttons.update')}
        </Button>
      </div>
    </div>
  );
};
