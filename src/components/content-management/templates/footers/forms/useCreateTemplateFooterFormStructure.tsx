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
import { useTranslation } from 'react-i18next';

interface useCreateTemplateFooterFormStructureProps {
  store: any;
  templateTypes: SelectOption[];
}

export const useCreateTemplateFooterFormStructure = ({
  store,
  templateTypes
}: useCreateTemplateFooterFormStructureProps) => {
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
    label: t('templateFooter.form.description', { defaultValue: 'Description' }),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('templateFooter.form.placeholders.description', {
      defaultValue: 'Enter description'
    }),
    description: t('templateFooter.form.descriptions.description', {
      defaultValue: 'Optional description'
    }),
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
    label: t('templateFooter.form.type', { defaultValue: 'Template Type' }),
    variant: FieldVariant.SELECT,
    placeholder: t('templateFooter.form.placeholders.type', {
      defaultValue: 'Select template type'
    }),
    description: t('templateFooter.form.descriptions.type', {
      defaultValue: 'The document type this footer applies to'
    }),
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

  const formStructure: FormStructure = {
    title: {
      value: 'Create Footer'
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
