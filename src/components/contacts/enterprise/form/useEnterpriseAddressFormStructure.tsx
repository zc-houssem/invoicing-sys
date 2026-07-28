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
  store: EnterpriseStore;
  countryOptions: SelectOption[];
}

export const useEnterpriseAddressFormStructure = ({
  store,
  countryOptions
}: useEnterpriseAddressFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');

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
          className: 'text-sm font-bold mt-6'
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

  return { addressInformation };
};
