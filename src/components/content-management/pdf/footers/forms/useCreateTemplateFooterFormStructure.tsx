import React from 'react';
import {
  Field,
  FieldVariant,
  FormStructure,
  ImageFieldProps,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useTranslation } from 'react-i18next';


interface useCreateTemplateFooterFormStructureProps {
  store: TemplateFooterStore;
}

export const useCreateTemplateFooterFormStructure = ({
  store
}: useCreateTemplateFooterFormStructureProps) => {
  const { t } = useTranslation('content-management');
  const [isUploadPending, setIsUploadPending] = React.useState(false);

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('templateFooter.form.name', { defaultValue: 'Name' }),
    variant: FieldVariant.TEXT,
    placeholder: t('templateFooter.form.placeholders.name', { defaultValue: 'Enter name' }),
    description: t('templateFooter.form.descriptions.name', { defaultValue: 'The name of the footer' }),
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
    placeholder: t('templateFooter.form.placeholders.description', { defaultValue: 'Enter description' }),
    description: t('templateFooter.form.descriptions.description', { defaultValue: 'Optional description' }),
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


  const formStructure: FormStructure = {
    title: {
      value: 'Create Footer'
    },
    includeHeader: false,
    fieldsets: [
      {
        rows: [
          { fields: [nameField] },
          { fields: [descriptionField] }
        ]
      }
    ]
  };

  return { formStructure };
};
