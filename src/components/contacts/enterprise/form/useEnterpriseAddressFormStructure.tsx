import React from 'react';
import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { Button } from '@/components/ui/button';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface useEnterpriseAddressFormStructureProps {
  isUpdate?: boolean;
  store: EnterpriseStore;
  countryOptions: SelectOption[];
}

export const useEnterpriseAddressFormStructure = ({
  store,
  countryOptions,
  isUpdate = false
}: useEnterpriseAddressFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  const dtoKey = isUpdate ? 'updateDto' : 'createDto';
  const dto = store[dtoKey];

  const deliveryAddressField: Field<TextFieldProps> = {
    id: 'delivery-address',
    label: tContact('address.form.address'),
    variant: FieldVariant.TEXT,
    description: tContact('address.form.descriptions.address'),
    placeholder: tContact('address.form.placeholders.address'),
    props: {
      value: dto?.deliveryAddress?.address,
      onChange: (value) => {
        store.setNested(`${dtoKey}.deliveryAddress.address`, value);
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
      value: dto?.deliveryAddress?.address2,
      onChange: (value) => {
        store.setNested(`${dtoKey}.deliveryAddress.address2`, value);
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
      value: dto?.deliveryAddress?.region,
      onChange: (value) => {
        store.setNested(`${dtoKey}.deliveryAddress.region`, value);
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
      value: dto?.deliveryAddress?.zipcode,
      onChange: (value) => {
        store.setNested(`${dtoKey}.deliveryAddress.zipcode`, value);
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
      value: dto?.deliveryAddress?.countryId?.toString(),
      onValueChange: (value) => {
        store.setNested(`${dtoKey}.deliveryAddress.countryId`, Number(value));
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
      value: dto?.invoicingAddress?.address,
      onChange: (value) => {
        store.setNested(`${dtoKey}.invoicingAddress.address`, value);
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
      value: dto?.invoicingAddress?.address2,
      onChange: (value) => {
        store.setNested(`${dtoKey}.invoicingAddress.address2`, value);
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
      value: dto?.invoicingAddress?.region,
      onChange: (value) => {
        store.setNested(`${dtoKey}.invoicingAddress.region`, value);
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
      value: dto?.invoicingAddress?.zipcode,
      onChange: (value) => {
        store.setNested(`${dtoKey}.invoicingAddress.zipcode`, value);
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
      value: dto?.invoicingAddress?.countryId?.toString(),
      onValueChange: (value) => {
        store.setNested(`${dtoKey}.invoicingAddress.countryId`, Number(value));
        store.setNested('errors.invoicingAddress.countryId', []);
      },
      options: countryOptions
    }
  };

  const deliveryAddressInformation: FormStructure = {
    title: {
      value: tContact('enterprise.form.deliveryAddress')
    },
    description: {
      value: tContact('enterprise.form.descriptions.deliveryAddress')
    },
    includeHeader: true,
    fieldsets: [
      {
        component: (
          <Button
            variant={'outline'}
            size="sm"
            type="button"
            onClick={() => {
              store.setNested(`${dtoKey}.deliveryAddress`, {
                ...dto?.invoicingAddress
              });
            }}>
            <Copy />
            <span className="text-xs">Copy Invoicing Address</span>
          </Button>
        ),
        rows: [
          {
            fields: [deliveryAddressField, deliveryAddress2Field]
          },
          {
            fields: [deliveryRegionField, deliveryZipCodeField, deliveryCountryField]
          }
        ]
      }
    ]
  };

  const invoicingAddressInformation: FormStructure = {
    title: {
      value: tContact('enterprise.form.invoicingAddress')
    },
    description: {
      value: tContact('enterprise.form.descriptions.invoicingAddress')
    },
    includeHeader: true,
    fieldsets: [
      {
        component: (
          <Button
            variant={'outline'}
            size="sm"
            type="button"
            onClick={() => {
              store.setNested(`${dtoKey}.invoicingAddress`, {
                ...dto?.deliveryAddress
              });
            }}>
            <Copy />
            <span className="text-xs">Copy Delivery Address</span>
          </Button>
        ),
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

  return {
    deliveryAddressInformation,
    invoicingAddressInformation,
    addressInformation: deliveryAddressInformation // fallback if referenced elsewhere
  };
};
