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
import { TemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useTranslation } from 'react-i18next';

interface useCreateTemplateHeaderFormStructureProps {
  store: TemplateHeaderStore;
  templateTypes: SelectOption[];
}

export const useCreateTemplateHeaderFormStructure = ({
  store,
  templateTypes
}: useCreateTemplateHeaderFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('templateHeader.form.name', { defaultValue: 'Name' }),
    variant: FieldVariant.TEXT,
    placeholder: t('templateHeader.form.placeholders.name', { defaultValue: 'Enter name' }),
    description: t('templateHeader.form.descriptions.name', {
      defaultValue: 'The name of the header'
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
    label: t('templateHeader.form.description', { defaultValue: 'Description' }),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('templateHeader.form.placeholders.description', {
      defaultValue: 'Enter description'
    }),
    description: t('templateHeader.form.descriptions.description', {
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
    label: t('templateHeader.form.type', { defaultValue: 'Template Type' }),
    variant: FieldVariant.SELECT,
    placeholder: t('templateHeader.form.placeholders.type', {
      defaultValue: 'Select template type'
    }),
    description: t('templateHeader.form.descriptions.type', {
      defaultValue: 'The document type this header applies to'
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
      value: 'Create Header'
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
