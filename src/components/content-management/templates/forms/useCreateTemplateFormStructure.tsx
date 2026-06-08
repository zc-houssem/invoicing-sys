import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  SingleFileFieldProps,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { useUploadMutation } from '@/hooks/content/core/useUploadMutation';
import { TemplateStore } from '@/hooks/stores/useTemplateStore';
import { useTranslation } from 'react-i18next';

interface useCreateTemplateFormStructureProps {
  store: TemplateStore;
  templateTypes: SelectOption[];
  uploadDocument: ReturnType<typeof useUploadMutation>['uploadFiles'];
}

export const useCreateTemplateFormStructure = ({
  store,
  templateTypes,
  uploadDocument
}: useCreateTemplateFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('template.form.name'),
    variant: FieldVariant.TEXT,
    placeholder: t('template.form.placeholders.name'),
    description: t('template.form.descriptions.name'),
    error: store.createDtoErrors?.name?.[0],
    props: {
      value: store.createDto.name,
      onChange: (value) => {
        store.setNested('createDto.name', value);
        store.setNested('createDtoErrors.name', []);
      }
    }
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: 'description',
    label: t('template.form.description'),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('template.form.placeholders.description'),
    description: t('template.form.descriptions.description'),
    error: store.createDtoErrors?.description?.[0],
    props: {
      value: store.createDto.description,
      onChange: (value) => {
        store.setNested('createDto.description', value);
        store.setNested('createDtoErrors.description', []);
      },
      rows: 4
    }
  };

  const typeField: Field<SelectFieldProps> = {
    id: 'type',
    label: t('template.form.type'),
    variant: FieldVariant.SELECT,
    placeholder: t('template.form.placeholders.type'),
    description: t('template.form.descriptions.type'),
    error: store.createDtoErrors?.templateTypeId?.[0],
    props: {
      value: store.createDto.templateTypeId,
      onValueChange: (value) => {
        store.setNested('createDto.templateTypeId', value);
        store.setNested('createDtoErrors.templateTypeId', []);
      },
      options: templateTypes
    }
  };

  const fileField: Field<SingleFileFieldProps> = {
    id: 'file',
    label: t('template.form.file'),
    variant: FieldVariant.FILE,
    placeholder: t('template.form.placeholders.file'),
    description: t('template.form.descriptions.file'),
    error: store.createDtoErrors?.documentId?.[0],
    props: {
      file: store.document,
      progress: store.progress,
      onFileChange: (value) => {
        store.set('document', value);
        store.setNested('createDtoErrors.documentId', []);
      },
      onUpload: (file, onProgress) => {
        store.set('progress', 0);
        uploadDocument({
          files: [file],
          onProgress: (progress: number) => {
            store.set('progress', progress);
            onProgress(progress);
          }
        });
      }
    }
  };

  const formStructure: FormStructure = {
    title: {
      value: 'Create Template'
    },
    includeHeader: false,
    fieldsets: [
      {
        rows: [
          {
            fields: [nameField]
          },
          {
            fields: [typeField]
          },
          {
            fields: [descriptionField]
          },
          {
            fields: [fileField]
          }
        ]
      }
    ]
  };

  return { formStructure };
};
