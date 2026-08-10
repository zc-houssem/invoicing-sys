import React from 'react';
import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useTranslation } from 'react-i18next';

interface useUpdateTemplateFooterFormStructureProps {
  store: any;
  templateTypes: SelectOption[];
}

export const useUpdateTemplateFooterFormStructure = ({
  store,
  templateTypes
}: useUpdateTemplateFooterFormStructureProps) => {
  const { t } = useTranslation('content-management');
  const [isUploadPending, setIsUploadPending] = React.useState(false);

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('templateFooter.form.name', { defaultValue: 'Name' }),
    variant: FieldVariant.TEXT,
    placeholder: t('templateFooter.form.placeholders.name', { defaultValue: 'Enter name' }),
    description: t('templateFooter.form.descriptions.name', {
      defaultValue: 'The name of the footer'
    }),
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
    label: t('templateFooter.form.description', { defaultValue: 'Description' }),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('templateFooter.form.placeholders.description', {
      defaultValue: 'Enter description'
    }),
    description: t('templateFooter.form.descriptions.description', {
      defaultValue: 'Optional description'
    }),
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
    label: t('templateFooter.form.type', { defaultValue: 'Template Type' }),
    variant: FieldVariant.SELECT,
    placeholder: t('templateFooter.form.placeholders.type', {
      defaultValue: 'Select template type'
    }),
    description: t('templateFooter.form.descriptions.type', {
      defaultValue: 'The document type this footer applies to'
    }),
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
      value: 'Update Footer'
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
