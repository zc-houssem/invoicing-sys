import {
  CustomFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  MultipleFilesFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
  TextareaFieldProps
} from '@/components/shared/form-builder/types';
import { ResponseEnterpriseDto, ResponseRefParamDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { PAYMENT_MODE } from '@/types/core/invoicing/payment';
import { PaymentStore } from '@/hooks/stores/usePaymentStore';
import { PaymentInvoiceManagement } from './PaymentInvoiceManagement';
import { PaymentFinancialInformation } from './PaymentFinancialInformation';
import { FieldBuilder } from '@/components/shared/form-builder/FieldBuilder';

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
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

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

        // Reset invoices
        const invoices =
          enterprise?.invoices
            ?.filter(
              (invoice: any) =>
                invoice?.status && ['PartiallyPaid', 'Sent', 'Unpaid'].includes(invoice?.status)
            )
            .map((invoice: any) => ({
              amount: 0,
              invoiceId: invoice.id,
              invoice: invoice
            })) || [];

        store.setNested('createDto.invoices', invoices);
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

  const convertionRateField: Field<TextFieldProps> = {
    id: 'convertionRate',
    label: tInvoicing('payment.form.convertionRate'),
    variant: FieldVariant.TEXT,
    placeholder: tInvoicing('payment.form.placeholders.convertionRate'),
    description: tInvoicing('payment.form.descriptions.convertionRate'),
    props: {
      disabled: loading,
      value: store.createDto.convertionRate?.toString(),
      onChange: (value) => {
        store.setNested('createDto.convertionRate', parseFloat(value || '1'));
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

  const amountField: Field<TextFieldProps> = {
    id: 'amount',
    label: tInvoicing('payment.form.amount'),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tInvoicing('payment.form.placeholders.amount'),
    description: tInvoicing('payment.form.descriptions.amount'),
    props: {
      disabled: loading,
      value: store.createDto.amount?.toString(),
      onChange: (value) => {
        store.setNested('createDto.amount', parseFloat(value || '0'));
      }
    }
  };

  const feeField: Field<TextFieldProps> = {
    id: 'fee',
    label: tInvoicing('payment.form.fee'),
    variant: FieldVariant.TEXT,
    placeholder: tInvoicing('payment.form.placeholders.fee'),
    description: tInvoicing('payment.form.descriptions.fee'),
    props: {
      disabled: loading,
      value: store.createDto.fee?.toString(),
      onChange: (value) => {
        store.setNested('createDto.fee', parseFloat(value || '0'));
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

  const notesField: Field<TextareaFieldProps> = {
    id: 'notes',
    label: tInvoicing('payment.form.notes'),
    variant: FieldVariant.TEXTAREA,
    placeholder: tInvoicing('payment.form.placeholders.notes'),
    description: tInvoicing('payment.form.descriptions.notes'),
    props: {
      disabled: loading,
      value: store.createDto.notes,
      onChange: (value) => {
        store.setNested('createDto.notes', value);
      },
      rows: 7
    }
  };

  const financialInformationField: Field<CustomFieldProps> = {
    id: 'financialInformation',
    variant: FieldVariant.CUSTOM,
    props: {
      children: <PaymentFinancialInformation loading={loading} />
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
          { fields: [dateField, enterpriseField] },
          { fields: [currencyField, convertionRateField, modeField] },
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
        title: { value: tInvoicing('payment.section.financial') },
        includeHeader: true,
        rows: [
          {
            fields: [
              {
                id: 'additionalInfo',
                variant: FieldVariant.CUSTOM,
                props: {
                  children: (
                    <div className="flex flex-col xl:flex-row gap-6">
                      <div className="w-full xl:w-2/3">
                        <FieldBuilder field={notesField} />
                      </div>
                      <div className="w-full xl:w-1/3 mt-6 xl:mt-0">
                        {financialInformationField.props?.children}
                      </div>
                    </div>
                  )
                }
              }
            ]
          }
        ]
      }
    ]
  };

  return { mainFormStructure };
};
