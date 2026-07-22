import React from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useRoles } from '@/hooks/content/useRoles';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { Button } from '@/components/ui/button';
import { useCreateUserFormStructure } from './useCreateUserFormStructure';
import { Save } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';



interface UserCreateFormProps {
  className?: string;
  createUser?: (user: CreateUserDto) => void;
  isCreatePending?: boolean;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  className,
  createUser,
  isCreatePending
}) => {
  const router = useRouter();
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
      { title: tUser('userManagement.sheet.createUserTitle') }
    ]);
    return () => {
      setRoutes?.([]);
      userStore.reset();
    };
  }, [router.locale]);

  const { uploadFiles: uploadProfilePicture, isUploadPending: isProfilePictureUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('createDto.pictureId', response?.[0]?.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      }
    });

  const { uploadFiles: uploadOfficialDocument, isUploadPending: isOfficialDocumentUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        userStore.setNested('createDto.officialDocumentId', response?.[0]?.id);
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
      userStore.setNested('createDto.driverLicenseDocumentId', response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    }
  });

  const { uploadFiles: uploadPhotos, isUploadPending: isPhotosUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.appendUploadId('create', { uploadId: response?.[0]?.id as number });
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
    isProfilePictureUploadPending,

    uploadOfficialDocument,
    isOfficialDocumentUploadPending,

    uploadDriverLicenseDocument,
    isDriverLicenseDocumentPending,

    uploadPhotos,
    isPhotosUploadPending
  });

  const { mutate: createMutation, isPending: isMutationPending } = useMutation({
    mutationFn: (user: CreateUserDto) => api.admin.user.create(user),
    onSuccess: () => {
      toast.success(tUser('userManagement.messages.userCreatedSuccess'));
      userStore.reset();
      router.push('/administrative-tools/user-management/users');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || tUser('userManagement.errors.generalError'));
    }
  });

  const isPending = isCreatePending ?? isMutationPending;

  const handleSubmit = () => {
    const userResult = createUserSchema.safeParse({
      ...userStore.createDto,
      confirmPassword: userStore.confirmPassword
    });
    if (!userResult.success) {
      userStore.set('createDtoErrors', userResult.error.flatten().fieldErrors);
      return;
    }
    userStore.set('createDtoErrors', {});

    if (createUser) {
      createUser(userStore.createDto);
    } else {
      createMutation(userStore.createDto);
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden gap-2 m-5 lg:mx-10', className)}>
      {isFetchRolesPending ? (
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
              <FormBuilder structure={userCreateFormStructure} />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
        <Button onClick={handleSubmit} disabled={isPending}>
          <Save /> {tCommon('common.buttons.save')}
        </Button>
      </div>
    </div>
  );
};
