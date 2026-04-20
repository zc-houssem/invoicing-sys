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

interface useCreateBankAccountFormStructureProps {
  store: BankAccountStore;
  currencies: SelectOption[];
}

export const useCreateBankAccountFormStructure = ({
  store,
  currencies
}: useCreateBankAccountFormStructureProps) => {
  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    description: 'Name of the bank account',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Al Baraka',
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
    label: 'BIC',
    description: 'Bank Identifier Code',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. BSTUTNTT',
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
    label: 'Currency',
    description: 'Currency of the bank account',
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: 'Select currency',
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
    label: 'RIB',
    description: 'Bank account number',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 1234567890',
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
    label: 'IBAN',
    description: 'International Bank Account Number',
    required: false,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. FR76 3000 6000 0112 3456 7890 189',
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
    label: 'Main Account',
    description:
      'If checked, this bank account will be set as the main account overriding the current main account if exists',
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
