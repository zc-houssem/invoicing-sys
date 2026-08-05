import {
  Field,
  FieldVariant,
  ImageFieldProps
} from '@/components/shared/form-builder/types';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { identifyEnterpriseAvatar } from '@/lib/enterprise';
import { TFunction } from 'i18next';

interface UseEnterpriseLogoFieldProps {
  store: EnterpriseStore;
  logoImage?: File | string | null;
  uploadLogo: ReturnType<typeof useUploadMutation>['uploadFiles'];
  isLogoUploadPending?: boolean;
  t: TFunction<'contacts'>;
}

export const useEnterpriseLogoField = ({
  store,
  logoImage,
  uploadLogo,
  isLogoUploadPending,
  t
}: UseEnterpriseLogoFieldProps): Field<ImageFieldProps> => {
  const enterpriseName =
    store.createDto?.name || store.updateDto?.name || store.response?.name;

  return {
    id: 'logo',
    label: t('enterprise.form.logo'),
    variant: FieldVariant.IMAGE,
    className: 'bg-muted border-2 w-40 h-40 my-2 rounded-lg',
    wrapperClassName: 'flex flex-col gap-2 items-center',
    required: false,
    description: t('enterprise.form.descriptions.logo'),
    error: store.errors?.logoId?.[0],
    props: {
      image: logoImage,
      fallback: identifyEnterpriseAvatar(enterpriseName),
      fallbackClassName: 'rounded-lg bg-muted text-sm font-medium text-muted-foreground',
      progress: store.progress,
      disabled: !!isLogoUploadPending,
      onFileChange: (value) => {
        store.set('logo', value);
        store.setNested('errors.logoId', []);
      },
      onUpload: (file, onProgress) => {
        store.set('progress', 0);
        uploadLogo({
          files: [file],
          onProgress: (progress: number) => {
            store.set('progress', progress);
            onProgress(progress);
          }
        });
      }
    }
  };
};
