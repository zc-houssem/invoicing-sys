import {
  CustomFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  MultipleFilesFieldProps,
  SelectFieldProps,
  SelectOption,
  NumberFieldProps,
  EditorFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { ResponseEnterpriseDto, ResponseRefParamDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { PAYMENT_MODE } from '@/types/core/invoicing/payment';
import { PaymentStore } from '@/hooks/stores/usePaymentStore';
import { PaymentInvoiceManagement } from './PaymentInvoiceManagement';
import { PaymentFinancialInformation } from './PaymentFinancialInformation';

interface usePaymentCreateFormStructureProps {
  store: PaymentStore;
  enterprises: ResponseEnterpriseDto[];
  currencies: SelectOption[];
  loading?: boolean;
}

export const usePaymentCreateFormStructure = ({
  store,
  enterprises,
  currencies,
  loading
}: usePaymentCreateFormStructureProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: tInvoicing('payment.form.date'),
    variant: FieldVariant.DATE,
    required: true,
    placeholder: tInvoicing('payment.form.placeholders.date'),
    description: tInvoicing('payment.form.descriptions.date'),
    props: {
      disabled: loading,
      value: store.createDto.date,
      onDateChange: (date) => {
        store.setNested('createDto.date', date);
      }
    }
  };

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: tInvoicing('payment.form.enterprise'),
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: tInvoicing('payment.form.placeholders.enterprise'),
    description: tInvoicing('payment.form.descriptions.enterprise'),
    props: {
      disabled: loading,
      value: store.createDto.enterpriseId?.toString(),
      onValueChange: (value) => {
        const enterpriseId = parseInt(value);
        const enterprise = enterprises?.find((e) => e.id === enterpriseId);
        store.setNested('createDto.enterpriseId', enterpriseId);

        // Find currency
        store.setNested('createDto.currencyId', enterprise?.currencyId);

        // Reset invoices array so PaymentInvoiceManagement fetches live invoices
        store.setNested('createDto.invoices', []);
      },
      options:
        enterprises?.map((ent) => ({
          label: ent.name || '',
          value: ent.id?.toString() || ''
        })) || []
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: tInvoicing('payment.form.currency'),
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('payment.form.placeholders.currency'),
    description: tInvoicing('payment.form.descriptions.currency'),
    props: {
      disabled: loading || currencies.length === 1,
      value: store.createDto.currencyId?.toString(),
      onValueChange: (value) => {
        const currencyId = parseInt(value);
        store.setNested('createDto.currencyId', currencyId);
        // Reset invoices
        store.setNested('createDto.invoices', []);
      },
      options: currencies
    }
  };

  const convertionRateField: Field<NumberFieldProps> = {
    id: 'convertionRate',
    label: tInvoicing('payment.form.convertionRate'),
    variant: FieldVariant.NUMBER,
    placeholder: tInvoicing('payment.form.placeholders.convertionRate'),
    description: tInvoicing('payment.form.descriptions.convertionRate'),
    props: {
      disabled: loading,
      value: store.createDto.convertionRate,
      onChange: (value) => {
        store.setNested('createDto.convertionRate', value ?? undefined);
      }
    }
  };

  const modeField: Field<SelectFieldProps> = {
    id: 'mode',
    label: tInvoicing('payment.form.mode'),
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('payment.form.placeholders.mode'),
    description: tInvoicing('payment.form.descriptions.mode'),
    required: true,
    props: {
      disabled: loading,
      value: store.createDto.mode,
      onValueChange: (value) => {
        store.setNested('createDto.mode', value as PAYMENT_MODE);
      },
      options: Object.values(PAYMENT_MODE).map((title) => ({
        label: tInvoicing(`payment.modes.${title}`),
        value: title as string
      }))
    }
  };

  const amountField: Field<NumberFieldProps> = {
    id: 'amount',
    label: tInvoicing('payment.form.amount'),
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: tInvoicing('payment.form.placeholders.amount'),
    description: tInvoicing('payment.form.descriptions.amount'),
    props: {
      disabled: loading,
      value: store.createDto.amount,
      onChange: (value) => {
        store.setNested('createDto.amount', value ?? undefined);
      }
    }
  };

  const feeField: Field<NumberFieldProps> = {
    id: 'fee',
    label: tInvoicing('payment.form.fee'),
    variant: FieldVariant.NUMBER,
    placeholder: tInvoicing('payment.form.placeholders.fee'),
    description: tInvoicing('payment.form.descriptions.fee'),
    props: {
      disabled: loading,
      value: store.createDto.fee,
      onChange: (value) => {
        store.setNested('createDto.fee', value ?? undefined);
      }
    }
  };

  const invoicesField: Field<CustomFieldProps> = {
    id: 'invoices',
    variant: FieldVariant.CUSTOM,
    props: {
      children: store.createDto.enterpriseId ? (
        <PaymentInvoiceManagement loading={loading} />
      ) : (
        <></>
      )
    }
  };

  const filesField: Field<MultipleFilesFieldProps> = {
    id: 'files',
    variant: FieldVariant.FILES,
    label: tInvoicing('payment.form.files'),
    props: {
      files: store.files,
      onFilesChange: (files) => {
        store.set('files', files);
      }
    }
  };

  const notesField: Field<EditorFieldProps> = {
    id: 'notes',
    variant: FieldVariant.EDITOR,
    placeholder: tInvoicing('payment.form.placeholders.notes'),
    description: tInvoicing('payment.form.descriptions.notes'),
    props: {
      disabled: loading,
      value: store.createDto.notes,
      onChange: (value) => {
        store.setNested('createDto.notes', value);
      }
    }
  };

  const financialInformationField: Field<CustomFieldProps> = {
    id: 'financialInformation',
    variant: FieldVariant.CUSTOM,
    props: {
      children: <PaymentFinancialInformation loading={loading} />
    }
  };

  const sequenceField: Field<TextFieldProps> = {
    id: 'sequence',
    label: tInvoicing('payment.form.sequence', { defaultValue: 'Sequence' }),
    description: tInvoicing('payment.form.descriptions.sequence', {
      defaultValue: 'Auto-generated sequence'
    }),
    variant: FieldVariant.TEXT,
    required: false,
    props: {
      disabled: true,
      value: store.sequencePreview || 'Loading...'
    }
  };

  const mainFormStructure: FormStructure = {
    title: { value: tInvoicing('payment.section.general') },
    toggleableFieldsets: true,
    orientation: 'horizontal',
    fieldsets: [
      {
        title: { value: tInvoicing('payment.section.general') },
        includeHeader: true,
        rows: [
          { fields: [dateField, sequenceField] },
          { fields: [enterpriseField, modeField] },
          { fields: [currencyField, convertionRateField] },
          { fields: [amountField, feeField] }
        ]
      },
      {
        title: { value: tInvoicing('payment.section.invoices') },
        includeHeader: true,
        rows: [{ fields: [invoicesField] }]
      },
      {
        title: { value: tInvoicing('payment.section.attachments') },
        includeHeader: true,
        rows: [{ fields: [filesField] }]
      },
      {
        title: { value: tInvoicing('payment.form.notes') },
        includeHeader: true,
        rows: [{ fields: [notesField] }]
      },
      {
        title: { value: tInvoicing('payment.section.financial') },
        includeHeader: true,
        rows: [{ fields: [financialInformationField] }]
      }
    ]
  };

  return { mainFormStructure };
};
