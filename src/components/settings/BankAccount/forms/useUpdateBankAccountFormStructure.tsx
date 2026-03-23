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

interface useUpdateBankAccountFormStructureProps {
  store: BankAccountStore;
  currencies: SelectOption[];
}

export const useUpdateBankAccountFormStructure = ({
  store,
  currencies
}: useUpdateBankAccountFormStructureProps) => {
  const nameField: Field<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    description: 'Name of the bank account',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Al Baraka',
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
    label: 'BIC',
    description: 'Bank Identifier Code',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. BSTUTNTT',
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
    label: 'Currency',
    description: 'Currency of the bank account',
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: 'Select currency',
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
    label: 'RIB',
    description: 'Bank account number',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 1234567890',
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
    label: 'IBAN',
    description: 'International Bank Account Number',
    required: false,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. FR76 3000 6000 0112 3456 7890 189',
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
    label: 'Main Account',
    description:
      'If checked, this bank account will be set as the main account overriding the current main account if exists',
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
    title: 'Bank Account Update Form',
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
