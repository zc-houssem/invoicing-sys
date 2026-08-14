import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TemplateStore } from '@/hooks/stores/useTemplateStore';
import { useTranslation } from 'react-i18next';

interface useUpdateTemplateFormStructureProps {
  store: TemplateStore;
  templateTypes: SelectOption[];
}

export const useUpdateTemplateFormStructure = ({
  store,
  templateTypes
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
    description:
      'PDF layout is configured on the server for each document type (header, footer, body elements).',
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

  const formStructure: FormStructure = {
    title: {
      value: 'Update Template'
    },
    includeHeader: false,
    fieldsets: [
      {
        rows: [{ fields: [nameField] }, { fields: [typeField] }, { fields: [descriptionField] }]
      }
    ]
  };

  return { formStructure };
};
