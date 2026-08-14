import {
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

interface useCreateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];

  uploadProfilePicture: ReturnType<typeof useUploadMutation>['uploadFiles'];
  isProfilePictureUploadPending?: boolean;
}

export const useCreateUserFormStructure = ({
  userStore,
  roles,
  uploadProfilePicture,
  isProfilePictureUploadPending
}: useCreateUserFormStructureProps) => {
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
    error: getError(userStore.createDtoErrors?.photo),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      placeholder: '/unknown-user.jpg',
      disabled: isProfilePictureUploadPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set('picture', value);
        userStore.setNested('createDtoErrors.pictureId', []);
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
    error: getError(userStore.createDtoErrors?.firstName),
    props: {
      value: userStore.createDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested('createDto.firstName', value);
        userStore.setNested('createDtoErrors.firstName', []);
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
    error: getError(userStore.createDtoErrors?.lastName),
    props: {
      value: userStore.createDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested('createDto.lastName', value);
        userStore.setNested('createDtoErrors.lastName', []);
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
    error: getError(userStore.createDtoErrors?.email),
    props: {
      value: userStore.createDto.email || undefined,
      onChange: (value) => {
        userStore.setNested('createDto.email', value);
        userStore.setNested('createDtoErrors.email', []);
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
    error: getError(userStore.createDtoErrors?.dateOfBirth),
    props: {
      value: userStore.createDto.dateOfBirth || undefined,
      onDateChange: (value: Date | null) => {
        userStore.setNested('createDto.dateOfBirth', value?.toISOString());
        userStore.setNested('createDtoErrors.dateOfBirth', []);
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
    error: getError(userStore.createDtoErrors?.username),
    props: {
      value: userStore.createDto.username || undefined,
      onChange: (value) => {
        userStore.setNested('createDto.username', value);
        userStore.setNested('createDtoErrors.username', []);
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
    error: getError(userStore.createDtoErrors?.password),
    props: {
      value: userStore.createDto.password || undefined,
      onChange: (value) => {
        userStore.setNested('createDto.password', value);
        userStore.setNested('createDtoErrors.password', []);
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
    error: getError(userStore.createDtoErrors?.confirmPassword),
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set('confirmPassword', value);
        userStore.setNested('createDtoErrors.confirmPassword', []);
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
    error: getError(userStore.createDtoErrors?.roleId),
    props: {
      options: roles,
      value: userStore.createDto.roleId,
      onValueChange: (value: string) => {
        userStore.setNested('createDto.roleId', value);
        userStore.setNested('createDtoErrors.roleId', []);
      }
    }
  };

  const userCreateFormStructure: FormStructure = {
    orientation: 'horizontal',
    fieldsets: [
      {
        title: { value: t('userManagement.forms.step1Title') },
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
        title: { value: t('userManagement.forms.step2Title') },
        includeHeader: true,
        rows: [
          {
            fields: [usernameField, roleField]
          },
          {
            fields: [passwordField, confirmPasswordField]
          }
        ]
      }
    ]
  };

  return {
    userCreateFormStructure
  };
};
