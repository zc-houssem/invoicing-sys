import {
  CheckboxFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  ImageFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { UserStore } from '@/hooks/stores/useUserStore';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { identifyUserAvatar } from '@/lib/user';
import { useTranslation } from 'react-i18next';

interface useUpdateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];

  uploadProfilePicture: ReturnType<typeof useUploadMutation>['uploadFiles'];
  isProfilePictureUploadPending?: boolean;
}

export const useUpdateUserFormStructure = ({
  userStore,
  roles,
  uploadProfilePicture,
  isProfilePictureUploadPending
}: useUpdateUserFormStructureProps) => {
  const { t } = useTranslation('user-management');

  const getError = (err?: string[]) => (err?.[0] ? t(err[0] as any) : undefined);

  //photo
  const photoField: Field<ImageFieldProps> = {
    id: 'photo',
    label: t('userManagement.forms.photo'),
    variant: FieldVariant.IMAGE,
    className: 'bg-muted border-2 w-40 h-40 my-2 rounded-full',
    wrapperClassName: 'flex flex-col gap-2 items-center',
    required: false,
    description: t('userManagement.forms.photoDescription'),
    error: getError(userStore.updateDtoErrors?.photo),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      placeholder: '/unknown-user.jpg',
      disabled: !!isProfilePictureUploadPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set('picture', value);
        userStore.setNested('updateDtoErrors.pictureId', []);
      },
      onUpload: (file, onProgress) => {
        userStore.set('progress', 0);
        uploadProfilePicture({
          files: [file],
          onProgress: (progress: number) => {
            userStore.set('progress', progress);
            onProgress(progress);
          }
        });
      }
    }
  };

  //first name
  const firstNameField: Field<TextFieldProps> = {
    id: 'firstname',
    label: t('userManagement.forms.firstName'),
    variant: FieldVariant.TEXT,
    required: false,
    placeholder: 'John',
    description: t('userManagement.forms.firstNameDescription'),
    error: getError(userStore.updateDtoErrors?.firstName),
    props: {
      value: userStore.updateDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested('updateDto.firstName', value);
        userStore.setNested('updateDtoErrors.firstName', []);
      }
    }
  };

  //last name
  const lastNameField: Field<TextFieldProps> = {
    id: 'lastname',
    label: t('userManagement.forms.lastName'),
    variant: FieldVariant.TEXT,
    required: false,
    placeholder: 'Doe',
    description: t('userManagement.forms.lastNameDescription'),
    error: getError(userStore.updateDtoErrors?.lastName),
    props: {
      value: userStore.updateDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested('updateDto.lastName', value);
        userStore.setNested('updateDtoErrors.lastName', []);
      }
    }
  };

  //email
  const emailField: Field<TextFieldProps> = {
    id: 'email',
    label: t('userManagement.forms.email'),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: 'john@doe.com',
    description: t('userManagement.forms.emailDescription'),
    error: getError(userStore.updateDtoErrors?.email),
    props: {
      value: userStore.updateDto.email || undefined,
      onChange: (value) => {
        userStore.setNested('updateDto.email', value);
        userStore.setNested('updateDtoErrors.email', []);
      }
    }
  };

  //date of birth
  const dateOfBirthField: Field<DateFieldProps> = {
    id: 'dateofbirth',
    label: t('userManagement.forms.dateOfBirth'),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: 'YYYY-MM-DD',
    description: t('userManagement.forms.dateOfBirthDescription'),
    error: getError(userStore.updateDtoErrors?.dateOfBirth),
    props: {
      value: userStore.updateDto.dateOfBirth || undefined,
      onDateChange: (value: Date | null) => {
        userStore.setNested('updateDto.dateOfBirth', value?.toISOString());
        userStore.setNested('updateDtoErrors.dateOfBirth', []);
      },
      nullable: true
    }
  };

  //username
  const usernameField: Field<TextFieldProps> = {
    id: 'username',
    label: t('userManagement.forms.username'),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t('userManagement.forms.usernamePlaceholder'),
    description: t('userManagement.forms.usernameDescription'),
    error: getError(userStore.updateDtoErrors?.username),
    props: {
      value: userStore.updateDto.username || undefined,
      onChange: (value) => {
        userStore.setNested('updateDto.username', value);
        userStore.setNested('updateDtoErrors.username', []);
      }
    }
  };

  const checkPasswordField: Field<CheckboxFieldProps> = {
    id: 'checkpassword',
    label: `${t('userManagement.forms.requirePasswordCheckTitle')}`,
    variant: FieldVariant.CHECKBOX,
    required: true,
    description: `${t('userManagement.forms.requirePasswordCheckDescription')}`,
    props: {
      checked: userStore.setManualPassword,
      onCheckedChange: (e) => {
        userStore.set('setManualPassword', !!e);
      }
    }
  };

  //password
  const passwordField: Field<PasswordFieldProps> = {
    id: 'password',
    label: t('userManagement.forms.password'),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t('userManagement.forms.passwordPlaceholder'),
    description: t('userManagement.forms.passwordDescription'),
    error: getError(userStore.updateDtoErrors?.password),
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.updateDto.password || undefined,
      onChange: (value) => {
        userStore.setNested('updateDto.password', value);
        userStore.setNested('updateDtoErrors.password', []);
      }
    }
  };

  //confirm password
  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: 'confirmpassword',
    label: t('userManagement.forms.confirmPassword'),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t('userManagement.forms.confirmPasswordPlaceholder'),
    description: t('userManagement.forms.confirmPasswordDescription'),
    error: getError(userStore.updateDtoErrors?.confirmPassword),
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set('confirmPassword', value);
        userStore.setNested('updateDtoErrors.confirmPassword', []);
      }
    }
  };

  //roles
  const roleField: Field<SelectFieldProps> = {
    id: 'role',
    label: t('userManagement.forms.role'),
    variant: FieldVariant.SELECT,
    required: true,
    description: t('userManagement.forms.roleDescription'),
    placeholder: t('userManagement.forms.rolePlaceholder'),
    error: getError(userStore.updateDtoErrors?.roleId),
    props: {
      options: roles,
      value: userStore.updateDto.roleId,
      onValueChange: (value: string) => {
        userStore.setNested('updateDto.roleId', value);
        userStore.setNested('updateDtoErrors.roleId', []);
      }
    }
  };

  const userUpdateFormStructure: FormStructure = {
    orientation: 'horizontal',
    fieldsets: [
      {
        title: { value: `${t('userManagement.forms.step1FieldTitle')}` },
        includeHeader: true,
        rows: [
          { fields: [photoField] },
          {
            fields: [firstNameField, lastNameField]
          },
          {
            fields: [emailField, dateOfBirthField]
          }
        ]
      },
      {
        title: { value: `${t('userManagement.forms.step1Title')}` },
        includeHeader: true,
        rows: [
          {
            fields: [usernameField, roleField]
          },
          { fields: [checkPasswordField] },
          {
            fields: [passwordField, confirmPasswordField]
          }
        ]
      }
    ]
  };

  return {
    userUpdateFormStructure
  };
};
