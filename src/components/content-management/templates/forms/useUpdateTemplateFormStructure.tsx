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

interface useUpdateTemplateFormStructureProps {
  store: TemplateStore;
  templateTypes: SelectOption[];
  uploadDocument: ReturnType<typeof useUploadMutation>['uploadFiles'];
}

export const useUpdateTemplateFormStructure = ({
  store,
  templateTypes,
  uploadDocument
}: useUpdateTemplateFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('template.form.name'),
    variant: FieldVariant.TEXT,
    placeholder: t('template.form.placeholders.name'),
    description: t('template.form.descriptions.name'),
    error: store.updateDtoErrors?.name?.[0],
    props: {
      value: store.updateDto?.name,
      onChange: (value) => {
        store.setNested('updateDto.name', value);
        store.setNested('updateDtoErrors.name', []);
      }
    }
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: 'description',
    label: t('template.form.description'),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('template.form.placeholders.description'),
    description: t('template.form.descriptions.description'),
    error: store.updateDtoErrors?.description?.[0],
    props: {
      value: store.updateDto?.description,
      onChange: (value) => {
        store.setNested('updateDto.description', value);
        store.setNested('updateDtoErrors.description', []);
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
    error: store.updateDtoErrors?.templateTypeId?.[0],
    props: {
      value: store.updateDto?.templateTypeId,
      onValueChange: (value) => {
        store.setNested('updateDto.templateTypeId', value);
        store.setNested('updateDtoErrors.templateTypeId', []);
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
    error: store.updateDtoErrors?.documentId?.[0],
    pending: !store.document,
    props: {
      file: store.document,
      progress: store.progress,
      onFileChange: (value) => {
        store.set('document', value);
        store.setNested('updateDtoErrors.documentId', []);
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
      value: 'Update Template'
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
