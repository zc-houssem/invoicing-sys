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

interface useCreateBankAccountFormStructureProps {
  store: BankAccountStore;
  currencies: SelectOption[];
}

export const useCreateBankAccountFormStructure = ({
  store,
  currencies
}: useCreateBankAccountFormStructureProps) => {
  const { t } = useTranslation('content-management');

  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: t('bankAccount.form.name'),
    description: t('bankAccount.form.descriptions.name'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.name'),
    error: store.createDtoErrors?.name?.[0],
    props: {
      value: store.createDto.name,
      onChange: (value) => {
        store.setNested('createDto.name', value);
        store.setNested('createDtoErrors.name', []);
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
    error: store.createDtoErrors?.bic?.[0],
    props: {
      value: store.createDto.bic,
      onChange: (value) => {
        store.setNested('createDto.bic', value);
        store.setNested('createDtoErrors.bic', []);
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

  const ribField: Field<TextFieldProps> = {
    id: 'rib',
    label: t('bankAccount.form.rib'),
    description: t('bankAccount.form.descriptions.rib'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: t('bankAccount.form.placeholders.rib'),
    error: store.createDtoErrors?.rib?.[0],
    props: {
      value: store.createDto.rib,
      onChange: (value) => {
        store.setNested('createDto.rib', value);
        store.setNested('createDtoErrors.rib', []);
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
    error: store.createDtoErrors?.iban?.[0],
    props: {
      value: store.createDto.iban,
      onChange: (value) => {
        store.setNested('createDto.iban', value);
        store.setNested('createDtoErrors.iban', []);
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
      checked: store.createDto.isMain,
      onCheckedChange: (checked) => {
        store.setNested('createDto.isMain', checked);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: 'Create Bank Account'
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
