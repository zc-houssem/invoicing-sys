import { AddressDetails } from '@/components/invoicing/AddressDetails';
import {
  CustomFieldProps,
  DateFieldProps,
  EditorFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  SingleFileFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { QuotationStore } from '@/hooks/stores/useQuotationStore';
import { ResponseEnterpriseDto } from '@/types/core/enterprise';
import { useTranslation } from 'react-i18next';
import { QuotationArticlesField } from './QuotationArticlesField';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { ArticleResume } from '../../articles/ArticleResume';

interface useQuotationCreateFormStructureProps {
  store: QuotationStore;
  enterprises: ResponseEnterpriseDto[];
  interlocutorOptions: SelectOption[];
  currencyOptions: SelectOption[];
  bankAccountOptions: SelectOption[];
  createQuotation: () => void;
  isCreationPending: boolean;
  selectedCurrency?: ResponseRefParamDto<CurrencyPayload>;
}

export const useQuotationCreateFormStructure = ({
  store,
  enterprises,
  interlocutorOptions,
  currencyOptions,
  bankAccountOptions,
  createQuotation,
  isCreationPending,
  selectedCurrency
}: useQuotationCreateFormStructureProps) => {
  const enterpriseStore = useEnterpriseStore();

  const { t } = useTranslation('invoicing');
  const { t: tContacts } = useTranslation('contacts');

  const singleFileField: Field<SingleFileFieldProps> = {
    id: 'file',
    label: 'Document',
    variant: FieldVariant.FILE,
    hidden: store.createDto.direction === 'outgoing',
    props: {
      // value: store.createDto.file,
      // onChange: (file) => store.setNested('createDto.file', file)
    }
  };

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: t('quotation.form.date'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.createDtoErrors.date?.[0],
    placeholder: t('quotation.form.placeholders.date'),
    description: t('quotation.form.descriptions.date'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.date,
      onDateChange: (date) => {
        store.setNested('createDto.date', date);
        store.setNested('createDtoErrors.date', []);
      }
    }
  };

  const dueDateField: Field<DateFieldProps> = {
    id: 'dueDate',
    label: t('quotation.form.dueDate'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.createDtoErrors.dueDate?.[0],
    placeholder: t('quotation.form.placeholders.dueDate'),
    description: t('quotation.form.descriptions.dueDate'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.dueDate,
      onDateChange: (date) => {
        store.setNested('createDto.dueDate', date);
        store.setNested('createDtoErrors.dueDate', []);
      }
    }
  };

  const objectField: Field<TextFieldProps> = {
    id: 'object',
    label: t('quotation.form.object'),
    variant: FieldVariant.TEXT,
    required: true,
    error: store.createDtoErrors.object?.[0],
    placeholder: t('quotation.form.placeholders.object'),
    description: t('quotation.form.descriptions.object'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.object,
      onChange: (value) => {
        store.setNested('createDto.object', value);
        store.setNested('createDtoErrors.object', []);
      }
    }
  };

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: t('quotation.form.enterprise'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.createDtoErrors.enterpriseId?.[0],
    placeholder: t('quotation.form.placeholders.enterprise'),
    description: t('quotation.form.descriptions.enterprise'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.enterpriseId ? store.createDto.enterpriseId.toString() : undefined,
      onValueChange: (value) => {
        const numericValue = Number(value);

        store.setNested('createDto.interlocutorId', undefined);
        store.setNested('createDtoErrors.interlocutorId', []);
        store.setNested('createDto.enterpriseId', numericValue);
        store.setNested('createDtoErrors.enterpriseId', []);

        const enterprise = enterprises.find((ent) => ent.id === numericValue);
        console.log('Selected enterprise:', enterprise);
        enterpriseStore.set('response', enterprise);
      },
      options: enterprises.map((ent) => ({
        label: ent.name,
        value: ent.id.toString()
      }))
    }
  };

  const interlocutorField: Field<SelectFieldProps> = {
    id: 'interlocutor',
    label: t('quotation.form.interlocutor'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.createDtoErrors.interlocutorId?.[0],
    placeholder: t('quotation.form.placeholders.interlocutor'),
    description: t('quotation.form.descriptions.interlocutor'),
    props: {
      disabled: isCreationPending || !store.createDto.enterpriseId,
      value: store.createDto.interlocutorId ? store.createDto.interlocutorId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('createDto.interlocutorId', Number(value));
        store.setNested('createDtoErrors.interlocutorId', []);
      },
      options: interlocutorOptions
    }
  };

  const generalConditionsField: Field<EditorFieldProps> = {
    id: 'generalConditions',
    label: t('quotation.form.generalConditions'),
    variant: FieldVariant.EDITOR,
    required: true,
    error: store.createDtoErrors.generalConditions?.[0],
    placeholder: t('quotation.form.placeholders.generalConditions'),
    description: t('quotation.form.descriptions.generalConditions'),
    props: {
      value: store.createDto.generalConditions,
      onChange: (value) => {
        store.setNested('createDto.generalConditions', value);
        store.setNested('createDtoErrors.generalConditions', []);
      }
    }
  };

  const invoicingAddressPseudoField: Field<CustomFieldProps> = {
    id: 'invoicing-address',
    variant: FieldVariant.CUSTOM,
    pending: !enterpriseStore.response?.invoicingAddress,
    props: {
      children: (
        <div>
          <span className="font-bold">{tContacts('enterprise.form.invoicingAddress')}</span>
          <AddressDetails address={enterpriseStore.response?.invoicingAddress} />
        </div>
      ),
      className: 'bg-red-500'
    }
  };

  const deliveryAddressPseudoField: Field<CustomFieldProps> = {
    id: 'delivery-address',
    variant: FieldVariant.CUSTOM,
    pending: !enterpriseStore.response?.deliveryAddress,
    props: {
      children: (
        <div>
          <span className="font-bold">{tContacts('enterprise.form.deliveryAddress')}</span>
          <AddressDetails address={enterpriseStore.response?.deliveryAddress} />
        </div>
      )
    }
  };

  const articlesField: Field<CustomFieldProps> = {
    id: 'articles',
    variant: FieldVariant.CUSTOM,
    props: {
      children: <QuotationArticlesField currency={selectedCurrency} />
    }
  };

  const additionalInfoField: Field<CustomFieldProps> = {
    id: 'additionalInfo',
    variant: FieldVariant.CUSTOM,
    props: {
      children: (
        <div className="flex flex-col 2xl:flex-row gap-6">
          <FormBuilder
            className="w-full 2xl:w-2/3"
            structure={{
              orientation: 'horizontal',
              fieldsets: [
                {
                  rows: [
                    {
                      fields: [generalConditionsField]
                    }
                  ]
                }
              ]
            }}
          />
          <ArticleResume className="w-full 2xl:w-1/3" currency={selectedCurrency} />
        </div>
      )
    }
  };

  const mainFormStructure: FormStructure = {
    title: {
      value: 'General Information'
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        title: {
          value: 'General Information'
        },
        includeHeader: true,
        rows: [
          {
            fields: [singleFileField]
          },
          {
            fields: [dateField, dueDateField]
          },
          {
            fields: [objectField]
          },
          {
            fields: [enterpriseField, interlocutorField]
          },
          {
            fields: [invoicingAddressPseudoField, deliveryAddressPseudoField]
          }
        ]
      },
      {
        title: {
          value: 'Articles'
        },
        includeHeader: true,
        rows: [
          {
            fields: [articlesField]
          }
        ]
      },
      {
        title: {
          value: 'Additional Information'
        },
        includeHeader: true,
        rows: [
          {
            fields: [additionalInfoField]
          }
        ]
      }
    ]
  };

  //*************************************************************************************************************************** */

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: t('quotation.form.currency'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.createDtoErrors.currencyId?.[0],
    placeholder: t('quotation.form.placeholders.currency'),
    description: t('quotation.form.descriptions.currency'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.currencyId ? store.createDto.currencyId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('createDto.currencyId', Number(value));
        store.setNested('createDtoErrors.currencyId', []);
      },
      options: currencyOptions
    }
  };

  const bankAccountField: Field<SelectFieldProps> = {
    id: 'bankAccount',
    label: t('quotation.form.bankAccount'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.createDtoErrors.bankAccountId?.[0],
    placeholder: t('quotation.form.placeholders.bankAccount'),
    description: t('quotation.form.descriptions.bankAccount'),
    props: {
      disabled: isCreationPending,
      value: store.createDto.bankAccountId ? store.createDto.bankAccountId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('createDto.bankAccountId', Number(value));
        store.setNested('createDtoErrors.bankAccountId', []);
      },
      options: bankAccountOptions
    }
  };

  const sidebarFormStructure: FormStructure = {
    title: {
      value: 'Sidebar'
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        rows: [
          {
            fields: [currencyField]
          },
          {
            fields: [bankAccountField]
          }
        ]
      }
    ]
  };

  return {
    mainFormStructure,
    sidebarFormStructure
  };
};
