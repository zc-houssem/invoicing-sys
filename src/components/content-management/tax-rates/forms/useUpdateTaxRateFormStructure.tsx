import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TaxRateStore } from '@/hooks/stores/useTaxRateStore';
import { useTranslation } from 'react-i18next';

interface useUpdateTaxRateFormStructureProps {
  store: TaxRateStore;
  currencies: SelectOption[];
}

export const useUpdateTaxRateFormStructure = ({
  store,
  currencies
}: useUpdateTaxRateFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const labelField: Field<TextFieldProps> = {
    id: 'label',
    label: t('taxRate.form.label'),
    description: t('taxRate.form.descriptions.label'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('taxRate.form.placeholders.label'),
    error: store.updateDtoErrors?.label?.[0],
    props: {
      value: store?.updateDto?.label,
      onChange: (value) => {
        store.setNested('updateDto.label', value);
        store.setNested('updateDtoErrors.label', []);
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
    error: store.updateDtoErrors?.value?.[0],
    props: {
      value: store?.updateDto?.value,
      onChange: (value) => {
        store.setNested('updateDto.value', value);
        store.setNested('updateDtoErrors.value', []);
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
    error: store.updateDtoErrors?.type?.[0],
    props: {
      options: [
        { label: t('taxRate.form.options.percentage'), value: 'rate' },
        { label: t('taxRate.form.options.fixed'), value: 'fixed' }
      ],
      value: store?.updateDto?.type,
      onValueChange: (value) => {
        store.setNested('updateDto.type', value);
        store.setNested('updateDtoErrors.type', []);
      }
    }
  };

  const specialField: Field<SwitchFieldProps> = {
    id: 'special',
    label: t('taxRate.form.special'),
    description: t('taxRate.form.descriptions.special'),
    variant: FieldVariant.SWITCH,
    props: {
      checked: store?.updateDto?.special,
      onCheckedChange: (checked) => {
        store.setNested('updateDto.special', checked);
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
    error: store.updateDtoErrors?.currencyId?.[0],
    props: {
      options: currencies,
      value: store?.updateDto?.currencyId?.toString() || undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.currencyId', Number(value));
        store.setNested('updateDtoErrors.currencyId', []);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: t('taxRate.sheets.update.title')
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
            fields: [specialField]
          },
          {
            fields: [currencyField]
          }
        ]
      }
    ]
  };

  return { structure };
};
