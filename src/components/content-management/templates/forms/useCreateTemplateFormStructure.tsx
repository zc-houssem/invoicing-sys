import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SingleFileFieldProps,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TemplateStore } from '@/hooks/stores/useTemplateStore';
import { TemplateType } from '@/types/core/template';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';

interface useCreateTemplateFormStructureProps {
  store: TemplateStore;
}

export const useCreateTemplateFormStructure = ({ store }: useCreateTemplateFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('template.form.name'),
    variant: FieldVariant.TEXT,
    placeholder: t('template.form.placeholders.name'),
    description: t('template.form.descriptions.name'),
    props: {
      value: store.createDto.name,
      onChange: (value) => store.setNested('createDto.name', value)
    }
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: 'description',
    label: t('template.form.description'),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('template.form.placeholders.description'),
    description: t('template.form.descriptions.description'),
    props: {
      value: store.createDto.description,
      onChange: (value) => store.setNested('createDto.description', value),
      rows: 4
    }
  };

  const typeField: Field<SelectFieldProps> = {
    id: 'type',
    label: t('template.form.type'),
    variant: FieldVariant.SELECT,
    placeholder: t('template.form.placeholders.type'),
    description: t('template.form.descriptions.type'),
    props: {
      value: store.createDto.templateType,
      onValueChange: (value) => store.setNested('createDto.templateType', value),
      options: Object.values(TemplateType).map((type) => ({
        label: capitalize(type),
        value: type
      }))
    }
  };

  const fileField: Field<SingleFileFieldProps> = {
    id: 'file',
    label: t('template.form.file'),
    variant: FieldVariant.FILE,
    placeholder: t('template.form.placeholders.file'),
    description: t('template.form.descriptions.file'),
    props: {
      file: store.document,
      onFileChange: (value) => store.set('document', value)
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
            fields: [fileField]
          },
          {
            fields: [nameField]
          },
          {
            fields: [typeField]
          },
          {
            fields: [descriptionField]
          }
        ]
      }
    ]
  };

  return { formStructure };
};
