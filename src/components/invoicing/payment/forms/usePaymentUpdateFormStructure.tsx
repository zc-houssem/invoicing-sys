import React from 'react';
import {
  CustomFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  MultipleFilesFieldProps,
  SelectFieldProps,
  TextFieldProps,
  TextareaFieldProps
} from '@/components/shared/form-builder/types';
import { ResponseEnterpriseDto, ResponseRefParamDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { PAYMENT_MODE } from '@/types/core/invoicing/payment';
import { PaymentStore } from '@/hooks/stores/usePaymentStore';
import { PaymentInvoiceManagement } from './PaymentInvoiceManagement';
import { PaymentFinancialInformation } from './PaymentFinancialInformation';

interface usePaymentUpdateFormStructureProps {
  store: PaymentStore;
  enterprises: ResponseEnterpriseDto[];
  currencies: ResponseRefParamDto[];
  loading?: boolean;
}

export const usePaymentUpdateFormStructure = ({
  store,
  enterprises,
  currencies,
  loading
}: usePaymentUpdateFormStructureProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: tInvoicing('invoice.attributes.date') + ' (*)',
    variant: FieldVariant.DATE,
    required: true,
    props: {
      disabled: loading,
      value: store.updateDto?.date,
      onDateChange: (date) => {
        store.setNested('updateDto.date', date);
      }
    }
  };

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: tCommon('submenu.enterprises') + ' (*)',
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: tInvoicing('invoice.associate_enterprise'),
    props: {
      disabled: true, // Typically cannot change firm on update
      value: store.updateDto?.enterpriseId?.toString(),
      onValueChange: (value) => {
        const enterpriseId = parseInt(value);
        const enterprise = enterprises?.find((e) => e.id === enterpriseId);
        store.setNested('updateDto.enterpriseId', enterpriseId);

        // Find currency
        store.setNested('updateDto.currencyId', enterprise?.currencyId);

        // Reset invoices
        store.setNested('updateDto.invoices', []);
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
    label: tInvoicing('payment.attributes.currency'),
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('controls.currency_select_placeholder'),
    props: {
      disabled: loading || currencies.length === 1,
      value: store.updateDto?.currencyId?.toString(),
      onValueChange: (value) => {
        const currencyId = parseInt(value);
        store.setNested('updateDto.currencyId', currencyId);
        // Reset invoices
        store.setNested('updateDto.invoices', []);
      },
      options:
        currencies?.map((currency: any) => ({
          label: `${currency?.code && tCurrency(currency?.code)} (${currency.symbol})`,
          value: currency.id?.toString() || ''
        })) || []
    }
  };

  const convertionRateField: Field<TextFieldProps> = {
    id: 'convertionRate',
    label: tInvoicing('payment.attributes.convertion_rate'),
    variant: FieldVariant.TEXT,
    placeholder: '1',
    props: {
      disabled: loading,
      value: store.updateDto?.convertionRate?.toString(),
      onChange: (value) => {
        store.setNested('updateDto.convertionRate', parseFloat(value || '1'));
      }
    }
  };

  const modeField: Field<SelectFieldProps> = {
    id: 'mode',
    label: tInvoicing('payment.attributes.mode') + ' (*)',
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('payment.attributes.mode'),
    required: true,
    props: {
      disabled: loading,
      value: store.updateDto?.mode,
      onValueChange: (value) => {
        store.setNested('updateDto.mode', value as PAYMENT_MODE);
      },
      options: Object.values(PAYMENT_MODE).map((title) => ({
        label: tInvoicing(title as string),
        value: title as string
      }))
    }
  };

  const amountField: Field<TextFieldProps> = {
    id: 'amount',
    label: tInvoicing('payment.attributes.amount'),
    variant: FieldVariant.TEXT,
    placeholder: '0',
    props: {
      disabled: loading,
      value: store.updateDto?.amount?.toString(),
      onChange: (value) => {
        store.setNested('updateDto.amount', parseFloat(value || '0'));
      }
    }
  };

  const feeField: Field<TextFieldProps> = {
    id: 'fee',
    label: tInvoicing('payment.attributes.fee'),
    variant: FieldVariant.TEXT,
    placeholder: '0',
    props: {
      disabled: loading,
      value: store.updateDto?.fee?.toString(),
      onChange: (value) => {
        store.setNested('updateDto.fee', parseFloat(value || '0'));
      }
    }
  };

  const invoicesField: Field<CustomFieldProps> = {
    id: 'invoices',
    variant: FieldVariant.CUSTOM,
    props: {
      children: store.updateDto?.enterpriseId ? (
        <PaymentInvoiceManagement loading={loading} />
      ) : (
        <></>
      )
    }
  };

  const filesField: Field<MultipleFilesFieldProps> = {
    id: 'files',
    variant: FieldVariant.FILES,
    label: tInvoicing('payment.attributes.files'),
    props: {
      files: store.files,
      onFilesChange: (files) => {
        store.set('files', files);
      }
    }
  };

  const notesField: Field<TextareaFieldProps> = {
    id: 'notes',
    label: tInvoicing('payment.attributes.notes'),
    variant: FieldVariant.TEXTAREA,
    placeholder: tInvoicing('payment.attributes.notes'),
    props: {
      disabled: loading,
      value: store.updateDto?.notes,
      onChange: (value) => {
        store.setNested('updateDto.notes', value);
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
    title: { value: 'General Information' },
    toggleableFieldsets: true,
    orientation: 'horizontal',
    fieldsets: [
      {
        title: { value: 'General Information' },
        includeHeader: true,
        rows: [
          { fields: [dateField, enterpriseField] },
          { fields: [currencyField, convertionRateField, modeField] },
          { fields: [amountField, feeField] }
        ]
      },
      {
        title: { value: 'Invoices' },
        includeHeader: true,
        rows: [{ fields: [invoicesField] }]
      },
      {
        title: { value: 'Attachments' },
        includeHeader: true,
        rows: [{ fields: [filesField] }]
      },
      {
        title: { value: 'Additional Information' },
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
                        <notesField.variant {...(notesField.props as any)} />
                      </div>
                      <div className="w-full xl:w-1/3 mt-6 xl:mt-0">
                        {financialInformationField.props.children}
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
