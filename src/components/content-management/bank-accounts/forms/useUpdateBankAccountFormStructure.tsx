import {
  CheckboxFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { BankAccountStore } from '@/hooks/stores/useBankAccountStore';
import { useTranslation } from 'react-i18next';

interface useUpdateBankAccountFormStructureProps {
  store: BankAccountStore;
  currencies: SelectOption[];
}

export const useUpdateBankAccountFormStructure = ({
  store,
  currencies
}: useUpdateBankAccountFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('bankAccount.form.name'),
    description: t('bankAccount.form.descriptions.name'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.name'),
    error: store.updateDtoErrors?.name?.[0],
    props: {
      value: store?.updateDto?.name,
      onChange: (value) => {
        store.setNested('updateDto.name', value);
        store.setNested('updateDtoErrors.name', []);
      }
    }
  };

  const bicField: Field<TextFieldProps> = {
    id: 'bic',
    label: t('bankAccount.form.bic'),
    description: t('bankAccount.form.descriptions.bic'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.bic'),
    error: store.updateDtoErrors?.bic?.[0],
    props: {
      value: store?.updateDto?.bic,
      onChange: (value) => {
        store.setNested('updateDto.bic', value);
        store.setNested('updateDtoErrors.bic', []);
      }
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: t('bankAccount.form.currency'),
    description: t('bankAccount.form.descriptions.currency'),
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: t('bankAccount.form.placeholders.currency'),
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

  const ribField: Field<TextFieldProps> = {
    id: 'rib',
    label: t('bankAccount.form.rib'),
    description: t('bankAccount.form.descriptions.rib'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.rib'),
    error: store.updateDtoErrors?.rib?.[0],
    props: {
      value: store?.updateDto?.rib,
      onChange: (value) => {
        store.setNested('updateDto.rib', value);
        store.setNested('updateDtoErrors.rib', []);
      }
    }
  };

  const ibanField: Field<TextFieldProps> = {
    id: 'iban',
    label: t('bankAccount.form.iban'),
    description: t('bankAccount.form.descriptions.iban'),
    required: false,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.iban'),
    error: store.updateDtoErrors?.iban?.[0],
    props: {
      value: store?.updateDto?.iban,
      onChange: (value) => {
        store.setNested('updateDto.iban', value);
        store.setNested('updateDtoErrors.iban', []);
      }
    }
  };

  const mainField: Field<CheckboxFieldProps> = {
    id: 'main',
    label: t('bankAccount.form.main'),
    description: t('bankAccount.form.descriptions.main'),
    required: false,
    variant: FieldVariant.CHECKBOX,
    props: {
      checked: store?.updateDto?.isMain,
      onCheckedChange: (checked) => {
        store.setNested('updateDto.isMain', checked);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: 'Update Bank Account'
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        rows: [
          {
            fields: [nameField]
          },
          {
            fields: [bicField, currencyField]
          },
          {
            fields: [ribField, ibanField]
          },
          {
            fields: [mainField]
          }
        ]
      }
    ]
  };

  return { structure };
};
