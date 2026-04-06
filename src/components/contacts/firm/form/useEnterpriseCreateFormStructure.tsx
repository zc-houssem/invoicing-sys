import {
  Field,
  FieldVariant,
  FormStructure,
  RadioFieldProps,
  TelFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { fieldBuilderFactory } from '@/components/shared/form-builder/utils/fieldBuilderFactory';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';

interface useEnterpriseCreateFormStructureProps {
  store: EnterpriseStore;
}

export const useEnterpriseCreateFormStructure = ({
  store
}: useEnterpriseCreateFormStructureProps) => {
  // enterprise information ****************************************************************************

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    required: true,
    error: store.error?.name?.[0],
    description: 'The name of the enterprise.',
    props: {
      value: store.createDto.name,
      onChange: (value) => store.setNested('createDto.name', value)
    }
  };

  const websiteField: Field<TextFieldProps> = {
    id: 'website',
    label: 'Website',
    variant: FieldVariant.TEXT,
    error: store.error?.website?.[0],
    description: 'The website of the enterprise.',
    props: {
      value: store.createDto.website,
      onChange: (value) => store.setNested('createDto.website', value)
    }
  };

  const taxIdNumberField: Field<TextFieldProps> = {
    id: 'taxIdNumber',
    label: 'Tax ID Number',
    variant: FieldVariant.TEXT,
    error: store.error?.taxIdNumber?.[0],
    description: 'The tax ID number of the enterprise.',
    props: {
      value: store.createDto.taxIdNumber,
      onChange: (value) => store.setNested('createDto.taxIdNumber', value)
    }
  };

  const phoneField: Field<TelFieldProps> = {
    id: 'phone',
    label: 'Phone',
    variant: FieldVariant.TEXT,
    error: store.error?.phone?.[0],
    description: 'The phone number of the enterprise.',
    props: {
      value: store.createDto.phone,
      onChange: (value) => store.setNested('createDto.phone', value)
    }
  };

  const particularField: Field<RadioFieldProps> = {
    id: 'particular',
    label: 'Particular',
    variant: FieldVariant.RADIO,
    description: 'Whether the enterprise is a particular or not.',
    props: {
      value: store.createDto.particular ? 'true' : 'false',
      onValueChange: (value) => store.setNested('createDto.particular', value === 'true'),
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ],
      spread: 'horizontal'
    }
  };

  const enterpriseInformation: FormStructure = {
    title: 'Enterprise information',
    fieldsets: [
      {
        rows: [
          {
            fields: [
              nameField,
              particularField,
              store.createDto.particular ? fieldBuilderFactory() : taxIdNumberField
            ]
          },
          {
            fields: [phoneField, websiteField]
          }
        ]
      }
    ]
  };

  // interlocutor information ****************************************************************************
  const interlocutorInformation: FormStructure = {
    title: 'Interlocutor information',
    fieldsets: []
  };

  // address information ****************************************************************************
  const addressInformation: FormStructure = {
    title: 'Address information',
    fieldsets: []
  };

  // additional information ****************************************************************************
  const additionalInformation: FormStructure = {
    title: 'Additional information',
    fieldsets: []
  };

  return {
    enterpriseInformation,
    interlocutorInformation,
    addressInformation,
    additionalInformation
  };
};
