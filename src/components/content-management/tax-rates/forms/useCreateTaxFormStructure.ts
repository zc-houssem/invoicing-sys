import {
  CheckboxFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TaxRateStore } from '@/hooks/stores/useTaxRateStore';
import { useTranslation } from 'react-i18next';

interface useCreateTaxRateFormStructureProps {
  store: TaxRateStore;
  currencies: SelectOption[];
}

export const useCreateTaxRateFormStructure = ({
  store,
  currencies
}: useCreateTaxRateFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const labelField: Field<TextFieldProps> = {
    id: 'label',
    label: t('taxRate.form.label'),
    description: t('taxRate.form.descriptions.label'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('taxRate.form.placeholders.label'),
    error: store.createDtoErrors?.label?.[0],
    props: {
      value: store.createDto.label,
      onChange: (value) => {
        store.setNested('createDto.label', value);
        store.setNested('createDtoErrors.label', []);
      }
    }
  };

  const valueField: Field<NumberFieldProps> = {
    id: 'value',
    label: t('taxRate.form.value'),
    description: t('taxRate.form.descriptions.value'),
    required: true,
    variant: FieldVariant.NUMBER,
    placeholder: t('taxRate.form.placeholders.value'),
    error: store.createDtoErrors?.value?.[0],
    props: {
      value: store.createDto.value,
      onChange: (value) => {
        store.setNested('createDto.value', value);
        store.setNested('createDtoErrors.value', []);
      }
    }
  };

  const typeField: Field<SelectFieldProps> = {
    id: 'type',
    label: t('taxRate.form.type'),
    description: t('taxRate.form.descriptions.type'),
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: t('taxRate.form.placeholders.type'),
    error: store.createDtoErrors?.type?.[0],
    props: {
      options: [
        { label: t('taxRate.form.options.percentage'), value: 'rate' },
        { label: t('taxRate.form.options.fixed'), value: 'fixed' }
      ],
      value: store.createDto.type,
      onValueChange: (value) => {
        store.setNested('createDto.type', value);
        store.setNested('createDtoErrors.type', []);
      }
    }
  };

  const specialField: Field<CheckboxFieldProps> = {
    id: 'special',
    label: t('taxRate.form.special'),
    description: t('taxRate.form.descriptions.special'),
    required: false,
    variant: FieldVariant.CHECKBOX,
    props: {
      checked: store.createDto.special,
      onCheckedChange: (checked) => {
        store.setNested('createDto.special', checked);
      }
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: t('taxRate.form.currency'),
    description: t('taxRate.form.descriptions.currency'),
    required: false,
    variant: FieldVariant.SELECT,
    placeholder: t('taxRate.form.placeholders.currency'),
    error: store.createDtoErrors?.currencyId?.[0],
    props: {
      options: currencies,
      value: store.createDto.currencyId?.toString() || undefined,
      onValueChange: (value) => {
        store.setNested('createDto.currencyId', Number(value));
        store.setNested('createDtoErrors.currencyId', []);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: t('taxRate.sheets.create.title')
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        rows: [
          {
            fields: [labelField]
          },
          {
            fields: [valueField, typeField]
          },
          {
            fields: [currencyField, specialField]
          }
        ]
      }
    ]
  };

  return { structure };
};
