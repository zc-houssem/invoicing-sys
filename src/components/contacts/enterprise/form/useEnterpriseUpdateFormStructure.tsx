import {
  EditorFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  RadioFieldProps,
  SelectFieldProps,
  SelectOption,
  TelFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { fieldBuilderFactory } from '@/components/shared/form-builder/utils/fieldBuilderFactory';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { SocialTitles } from '@/types/core/enterprise';
import { useTranslation } from 'react-i18next';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { useEnterpriseLogoField } from './useEnterpriseLogoField';

interface useEnterpriseUpdateFormStructureProps {
  store: EnterpriseStore;
  activityOptions: SelectOption[];
  currencyOptions: SelectOption[];
  paymentConditionOptions: SelectOption[];
  countryOptions: SelectOption[];
  logoImage?: File | string | null;
  uploadLogo: ReturnType<typeof useUploadMutation>['uploadFiles'];
  isLogoUploadPending?: boolean;
}

export const useEnterpriseUpdateFormStructure = ({
  store,
  activityOptions,
  currencyOptions,
  paymentConditionOptions,
  countryOptions,
  logoImage,
  uploadLogo,
  isLogoUploadPending
}: useEnterpriseUpdateFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  // enterprise information ****************************************************************************

  const logoField = useEnterpriseLogoField({
    store,
    logoImage,
    uploadLogo,
    isLogoUploadPending,
    t: tContact
  });

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: tContact('enterprise.form.name'),
    variant: FieldVariant.TEXT,
    required: true,
    error: store.errors?.name?.[0],
    description: tContact('enterprise.form.descriptions.name'),
    placeholder: tContact('enterprise.form.placeholders.name'),
    props: {
      value: store.updateDto?.name,
      onChange: (value) => {
        store.setNested('updateDto.name', value);
        store.setNested('errors.name', []);
      }
    }
  };

  const websiteField: Field<TextFieldProps> = {
    id: 'website',
    label: tContact('enterprise.form.website'),
    variant: FieldVariant.URL,
    error: store.errors?.website?.[0],
    description: tContact('enterprise.form.descriptions.website'),
    placeholder: tContact('enterprise.form.placeholders.website'),
    props: {
      value: store.updateDto?.website,
      onChange: (value) => {
        store.setNested('updateDto.website', value);
        store.setNested('errors.website', []);
      }
    }
  };

  const taxIdNumberField: Field<TextFieldProps> = {
    id: 'taxIdNumber',
    label: tContact('enterprise.form.taxId'),
    variant: FieldVariant.TEXT,
    required: !store.updateDto?.particular,
    error: store.errors?.taxId?.[0],
    description: tContact('enterprise.form.descriptions.taxId'),
    placeholder: tContact('enterprise.form.placeholders.taxId'),
    props: {
      value: store.updateDto?.taxId,
      onChange: (value) => {
        store.setNested('updateDto.taxId', value);
        store.setNested('errors.taxId', []);
      }
    }
  };

  const phoneField: Field<TelFieldProps> = {
    id: 'phone',
    label: tContact('enterprise.form.phone'),
    variant: FieldVariant.TEL,
    error: store.errors?.phone?.[0],
    description: tContact('enterprise.form.descriptions.phone'),
    placeholder: tContact('enterprise.form.placeholders.phone'),
    props: {
      value: store.updateDto?.phone,
      onChange: (value) => {
        store.setNested('updateDto.phone', value);
        store.setNested('errors.phone', []);
      }
    }
  };

  const particularField: Field<RadioFieldProps> = {
    id: 'particular',
    label: tContact('enterprise.form.particular.noun'),
    variant: FieldVariant.RADIO,
    description: tContact('enterprise.form.descriptions.particular'),
    props: {
      value: store.updateDto?.particular ? 'true' : 'false',
      onValueChange: (value) => {
        store.setNested('updateDto.particular', value === 'true');
        store.setNested('errors.particular', []);
        store.setNested('updateDto.taxId', '');
        store.setNested('errors.taxId', []);
      },
      options: [
        { label: tContact('enterprise.form.particular.positive'), value: 'true' },
        { label: tContact('enterprise.form.particular.negative'), value: 'false' }
      ],
      spread: 'horizontal'
    }
  };

  const activityField: Field<SelectFieldProps> = {
    id: 'activityId',
    label: tContact('enterprise.form.activity'),
    variant: FieldVariant.SELECT,
    description: tContact('enterprise.form.descriptions.activity'),
    placeholder: tContact('enterprise.form.placeholders.activity'),
    error: store.errors?.activityId?.[0],
    props: {
      value: store.updateDto?.activityId?.toString(),
      onValueChange: (value) => {
        store.setNested('updateDto.activityId', Number(value));
        store.setNested('errors.activityId', []);
      },
      options: activityOptions
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currencyId',
    label: tContact('enterprise.form.currency'),
    variant: FieldVariant.SELECT,
    description: tContact('enterprise.form.descriptions.currency'),
    placeholder: tContact('enterprise.form.placeholders.currency'),
    error: store.errors?.currencyId?.[0],
    props: {
      value: store.updateDto?.currencyId?.toString(),
      onValueChange: (value) => {
        store.setNested('updateDto.currencyId', Number(value));
        store.setNested('errors.currencyId', []);
      },
      options: currencyOptions
    }
  };

  const paymentConditionField: Field<SelectFieldProps> = {
    id: 'paymentConditionId',
    label: tContact('enterprise.form.paymentConditions'),
    variant: FieldVariant.SELECT,
    description: tContact('enterprise.form.descriptions.paymentConditions'),
    placeholder: tContact('enterprise.form.placeholders.paymentConditions'),
    error: store.errors?.paymentConditionId?.[0],
    props: {
      value: store.updateDto?.paymentConditionId?.toString(),
      onValueChange: (value) => {
        store.setNested('updateDto.paymentConditionId', Number(value));
        store.setNested('errors.paymentConditionId', []);
      },
      options: paymentConditionOptions
    }
  };

  const enterpriseInformation: FormStructure = {
    title: {
      value: 'Enterprise information'
    },
    description: {
      value: 'Basic information about the enterprise.'
    },
    includeHeader: true,
    fieldsets: [
      {
        rows: [
          {
            fields: [logoField]
          },
          {
            fields: [nameField]
          },
          {
            fields: [
              particularField,
              store.updateDto?.particular ? fieldBuilderFactory() : taxIdNumberField
            ]
          },
          {
            fields: [phoneField, websiteField]
          },
          {
            fields: [activityField, currencyField, paymentConditionField]
          }
        ]
      }
    ]
  };

  // interlocutor information ****************************************************************************
  const socialTitleField: Field<SelectFieldProps> = {
    id: 'interlocutor-title',
    label: tContact('interlocutor.form.socialTitle'),
    variant: FieldVariant.SELECT,
    description: tContact('interlocutor.form.descriptions.socialTitle'),
    placeholder: tContact('interlocutor.form.placeholders.socialTitle'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.interlocutor?.title,
      onValueChange: (value) => {
        store.setNested('updateDto.interlocutors.0.interlocutor.title', value);
        store.setNested('errors.interlocutors.0.interlocutor.title', []);
      },
      options: Object.values(SocialTitles).map((title) => ({
        label: title,
        value: title
      }))
    }
  };

  const firstNameField: Field<TextFieldProps> = {
    id: 'interlocutor-first-name',
    label: tContact('interlocutor.form.firstName'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.firstName'),
    placeholder: tContact('interlocutor.form.placeholders.firstName'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.interlocutor?.firstName ?? '',
      onChange: (value) => {
        store.setNested('updateDto.interlocutors.0.interlocutor.firstName', value);
        store.setNested('errors.interlocutors.0.interlocutor.firstName', []);
      }
    }
  };

  const lastNameField: Field<TextFieldProps> = {
    id: 'interlocutor-last-name',
    label: tContact('interlocutor.form.lastName'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.lastName'),
    placeholder: tContact('interlocutor.form.placeholders.lastName'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.interlocutor?.lastName ?? '',
      onChange: (value) => {
        store.setNested('updateDto.interlocutors.0.interlocutor.lastName', value);
        store.setNested('errors.interlocutors.0.interlocutor.lastName', []);
      }
    }
  };

  const emailField: Field<TextFieldProps> = {
    id: 'interlocutor-email',
    label: tContact('interlocutor.form.email'),
    variant: FieldVariant.EMAIL,
    description: tContact('interlocutor.form.descriptions.email'),
    placeholder: tContact('interlocutor.form.placeholders.email'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.interlocutor?.email ?? '',
      onChange: (value) => {
        store.setNested('updateDto.interlocutors.0.interlocutor.email', value);
        store.setNested('errors.interlocutors.0.interlocutor.email', []);
      }
    }
  };

  const phoneFieldInterlocutor: Field<TelFieldProps> = {
    id: 'interlocutor-phone',
    label: tContact('interlocutor.form.phone'),
    variant: FieldVariant.TEL,
    description: tContact('interlocutor.form.descriptions.phone'),
    placeholder: tContact('interlocutor.form.placeholders.phone'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.interlocutor?.phone ?? '',
      onChange: (value) => {
        store.setNested('updateDto.interlocutors.0.interlocutor.phone', value);
        store.setNested('errors.interlocutors.0.interlocutor.phone', []);
      }
    }
  };

  const positionField: Field<TextFieldProps> = {
    id: 'interlocutor-position',
    label: tContact('interlocutor.form.position'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.position'),
    placeholder: tContact('interlocutor.form.placeholders.position'),
    props: {
      value: store.updateDto?.interlocutors?.[0]?.position ?? '',
      onChange: (value) => {
        store.setNested('updateDto.interlocutors.0.position', value);
        store.setNested('errors.interlocutors.0.position', []);
      }
    }
  };

  const interlocutorInformation: FormStructure = {
    fieldsets: [
      {
        rows: [
          {
            fields: [socialTitleField, firstNameField, lastNameField]
          },
          {
            fields: [emailField, phoneFieldInterlocutor]
          },
          {
            fields: [positionField]
          }
        ]
      }
    ]
  };

  // additional information ****************************************************************************
  const noteField: Field<EditorFieldProps> = {
    id: 'note',
    label: 'Note',
    variant: FieldVariant.EDITOR,
    description: 'Additional notes about the enterprise.',
    props: {
      value: store.updateDto?.notes,
      onChange: (value) => {
        store.setNested('updateDto.notes', value);
        store.setNested('errors.notes', []);
      }
    }
  };

  const additionalInformation: FormStructure = {
    title: {
      value: 'Additional information'
    },
    description: {
      value: 'Additional information about the enterprise.'
    },
    includeHeader: true,
    fieldsets: [
      {
        rows: [
          {
            fields: [noteField]
          }
        ]
      }
    ]
  };

  return {
    enterpriseInformation,
    interlocutorInformation,
    additionalInformation
  };
};
