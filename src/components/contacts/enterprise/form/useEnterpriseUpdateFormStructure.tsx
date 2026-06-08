import {
  EditorFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  SelectOption,
  TelFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { fieldBuilderFactory } from '@/components/shared/form-builder/utils/fieldBuilderFactory';
import { Button } from '@/components/ui/button';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { SocialTitles } from '@/types/core/enterprise';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface useEnterpriseUpdateFormStructureProps {
  store: EnterpriseStore;
  activityOptions: SelectOption[];
  currencyOptions: SelectOption[];
  paymentConditionOptions: SelectOption[];
  countryOptions: SelectOption[];
}

export const useEnterpriseUpdateFormStructure = ({
  store,
  activityOptions,
  currencyOptions,
  paymentConditionOptions,
  countryOptions
}: useEnterpriseUpdateFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  // enterprise information ****************************************************************************

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
    variant: FieldVariant.TEXT,
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
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
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
    orientation: 'horizontal',
    fieldsets: [
      {
        includeHeader: true,
        rows: [
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
    variant: FieldVariant.TEXT,
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
    title: {
      value: 'Interlocutor information'
    },
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

  // address information ****************************************************************************
  const deliveryAddressField: Field<TextFieldProps> = {
    id: 'delivery-address',
    label: tContact('address.form.address'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.address'),
    placeholder: tContact('address.form.placeholders.address'),
    props: {
      value: store.updateDto?.deliveryAddress?.address,
      onChange: (value) => {
        store.setNested('updateDto.deliveryAddress.address', value);
        store.setNested('errors.deliveryAddress.address', []);
      }
    }
  };

  const deliveryAddress2Field: Field<TextFieldProps> = {
    id: 'delivery-address2',
    label: tContact('address.form.address2'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.address2'),
    placeholder: tContact('address.form.placeholders.address2'),
    props: {
      value: store.updateDto?.deliveryAddress?.address2,
      onChange: (value) => {
        store.setNested('updateDto.deliveryAddress.address2', value);
        store.setNested('errors.deliveryAddress.address2', []);
      }
    }
  };

  const deliveryRegionField: Field<TextFieldProps> = {
    id: 'delivery-region',
    label: tContact('address.form.region'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.region'),
    placeholder: tContact('address.form.placeholders.region'),
    props: {
      value: store.updateDto?.deliveryAddress?.region,
      onChange: (value) => {
        store.setNested('updateDto.deliveryAddress.region', value);
        store.setNested('errors.deliveryAddress.region', []);
      }
    }
  };

  const deliveryZipCodeField: Field<NumberFieldProps> = {
    id: 'delivery-zipcode',
    label: tContact('address.form.zipCode'),
    variant: FieldVariant.NUMBER,
    description: tContact('address.form.descriptions.zipCode'),
    placeholder: tContact('address.form.placeholders.zipCode'),
    props: {
      value: store.updateDto?.deliveryAddress?.zipcode,
      onChange: (value) => {
        store.setNested('updateDto.deliveryAddress.zipcode', value);
        store.setNested('errors.deliveryAddress.zipcode', []);
      }
    }
  };

  const deliveryCountryField: Field<SelectFieldProps> = {
    id: 'delivery-country',
    label: tContact('address.form.country'),
    variant: FieldVariant.SELECT,
    description: tContact('address.form.descriptions.country'),
    placeholder: tContact('address.form.placeholders.country'),
    props: {
      value: store.updateDto?.deliveryAddress?.countryId?.toString(),
      onValueChange: (value) => {
        store.setNested('updateDto.deliveryAddress.countryId', Number(value));
        store.setNested('errors.deliveryAddress.countryId', []);
      },
      options: countryOptions
    }
  };

  const invoicingAddressField: Field<TextFieldProps> = {
    id: 'invoicing-address',
    label: tContact('address.form.address'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.address'),
    placeholder: tContact('address.form.placeholders.address'),
    props: {
      value: store.updateDto?.invoicingAddress?.address,
      onChange: (value) => {
        store.setNested('updateDto.invoicingAddress.address', value);
        store.setNested('errors.invoicingAddress.address', []);
      }
    }
  };

  const invoicingAddress2Field: Field<TextFieldProps> = {
    id: 'invoicing-address2',
    label: tContact('address.form.address2'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.address2'),
    placeholder: tContact('address.form.placeholders.address2'),
    props: {
      value: store.updateDto?.invoicingAddress?.address2,
      onChange: (value) => {
        store.setNested('updateDto.invoicingAddress.address2', value);
        store.setNested('errors.invoicingAddress.address2', []);
      }
    }
  };

  const invoicingRegionField: Field<TextFieldProps> = {
    id: 'invoicing-region',
    label: tContact('address.form.region'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.region'),
    placeholder: tContact('address.form.placeholders.region'),
    props: {
      value: store.updateDto?.invoicingAddress?.region,
      onChange: (value) => {
        store.setNested('updateDto.invoicingAddress.region', value);
        store.setNested('errors.invoicingAddress.region', []);
      }
    }
  };

  const invoicingZipCodeField: Field<NumberFieldProps> = {
    id: 'invoicing-zipcode',
    label: tContact('address.form.zipCode'),
    variant: FieldVariant.NUMBER,
    description: tContact('address.form.descriptions.zipCode'),
    placeholder: tContact('address.form.placeholders.zipCode'),
    props: {
      value: store.updateDto?.invoicingAddress?.zipcode,
      onChange: (value) => {
        store.setNested('updateDto.invoicingAddress.zipcode', value);
        store.setNested('errors.invoicingAddress.zipcode', []);
      }
    }
  };

  const invoicingCountryField: Field<SelectFieldProps> = {
    id: 'invoicing-country',
    label: tContact('address.form.country'),
    variant: FieldVariant.SELECT,
    description: tContact('address.form.descriptions.country'),
    placeholder: tContact('address.form.placeholders.country'),
    props: {
      value: store.updateDto?.invoicingAddress?.countryId?.toString(),
      onValueChange: (value) => {
        store.setNested('updateDto.invoicingAddress.countryId', Number(value));
        store.setNested('errors.invoicingAddress.countryId', []);
      },
      options: countryOptions
    }
  };

  const addressInformation: FormStructure = {
    title: {
      value: tContact('enterprise.form.addressInformation')
    },
    fieldsets: [
      {
        title: {
          value: tContact('enterprise.form.deliveryAddress'),
          className: 'text-sm font-bold'
        },
        description: {
          value: tContact('enterprise.form.descriptions.deliveryAddress'),
          className: 'text-xs'
        },
        component: (
          <Button
            variant={'outline'}
            size="sm"
            type="button"
            onClick={() => {
              store.setNested('updateDto.deliveryAddress', {
                ...store.updateDto?.invoicingAddress
              });
            }}>
            <Copy />
            <span className="text-xs">Copy Invoicing Address</span>
          </Button>
        ),
        includeHeader: true,
        rows: [
          {
            fields: [deliveryAddressField, deliveryAddress2Field]
          },
          {
            fields: [deliveryRegionField, deliveryZipCodeField, deliveryCountryField]
          }
        ]
      },
      {
        title: {
          value: tContact('enterprise.form.invoicingAddress'),
          className: 'text-sm font-bold'
        },
        description: {
          value: tContact('enterprise.form.descriptions.invoicingAddress'),
          className: 'text-xs'
        },
        component: (
          <Button
            variant={'outline'}
            size="sm"
            type="button"
            onClick={() => {
              store.setNested('updateDto.invoicingAddress', {
                ...store.updateDto?.deliveryAddress
              });
            }}>
            <Copy />
            <span className="text-xs">Copy Delivery Address</span>
          </Button>
        ),
        includeHeader: true,
        rows: [
          {
            fields: [invoicingAddressField, invoicingAddress2Field]
          },
          {
            fields: [invoicingRegionField, invoicingZipCodeField, invoicingCountryField]
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
    addressInformation,
    additionalInformation
  };
};
