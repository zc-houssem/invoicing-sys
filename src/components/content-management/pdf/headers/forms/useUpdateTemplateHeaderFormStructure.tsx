import React from 'react';
import {
  Field,
  FieldVariant,
  FormStructure,
  ImageFieldProps,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useTranslation } from 'react-i18next';


interface useUpdateTemplateHeaderFormStructureProps {
  store: TemplateHeaderStore;
}

export const useUpdateTemplateHeaderFormStructure = ({
  store
}: useUpdateTemplateHeaderFormStructureProps) => {
  const { t } = useTranslation('content-management');
  const [isUploadPending, setIsUploadPending] = React.useState(false);

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('templateHeader.form.name', { defaultValue: 'Name' }),
    variant: FieldVariant.TEXT,
    placeholder: t('templateHeader.form.placeholders.name', { defaultValue: 'Enter name' }),
    description: t('templateHeader.form.descriptions.name', { defaultValue: 'The name of the header' }),
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
    label: t('templateHeader.form.description', { defaultValue: 'Description' }),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('templateHeader.form.placeholders.description', { defaultValue: 'Enter description' }),
    description: t('templateHeader.form.descriptions.description', { defaultValue: 'Optional description' }),
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


  const formStructure: FormStructure = {
    title: {
      value: 'Update Header'
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
