import { AddressDetails } from '@/components/invoicing/AddressDetails';
import {
  CustomFieldProps,
  DateFieldProps,
  EditorFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  MultipleFilesFieldProps,
  SelectFieldProps,
  SelectOption,
  SingleFileFieldProps,
  TextFieldProps,
  TextareaFieldProps
} from '@/components/shared/form-builder/types';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { QuotationStore } from '@/hooks/stores/useQuotationStore';
import { ResponseEnterpriseDto } from '@/types/core/enterprise';
import { useTranslation } from 'react-i18next';
import { QuotationArticlesField } from './QuotationArticlesField';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { ArticleResume } from '../../articles/ArticleResume';
import { Button } from '@/components/ui/button';
import { BrushCleaning, Newspaper } from 'lucide-react';

interface useQuotationCreateFormStructureProps {
  store: QuotationStore;
  enterprises: ResponseEnterpriseDto[];
  interlocutorOptions: SelectOption[];
  currencyOptions: SelectOption[];
  bankAccountOptions: SelectOption[];
  isCreationPending: boolean;
  selectedCurrency?: ResponseRefParamDto<CurrencyPayload>;
  onAttachmentsUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void>;
}

export const useQuotationCreateFormStructure = ({
  store,
  enterprises,
  interlocutorOptions,
  currencyOptions,
  bankAccountOptions,
  isCreationPending,
  selectedCurrency,
  onAttachmentsUpload
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

  const generalConditionsField: Field<TextareaFieldProps> = {
    id: 'generalConditions',
    label: t('quotation.form.generalConditions'),
    variant: FieldVariant.TEXTAREA,
    required: true,
    error: store.createDtoErrors.generalConditions?.[0],
    placeholder: t('quotation.form.placeholders.generalConditions'),
    description: t('quotation.form.descriptions.generalConditions'),
    props: {
      value: store.createDto.generalConditions,
      onChange: (value) => {
        store.setNested('createDto.generalConditions', value);
        store.setNested('createDtoErrors.generalConditions', []);
      },
      rows: 10
    }
  };

  const defaultGeneralConditionsActionsField: Field<CustomFieldProps> = {
    id: 'defaultGeneralConditionsActions',
    variant: FieldVariant.CUSTOM,
    props: {
      children: (
        <div className="flex gap-2">
          <Button size="sm">
            <Newspaper className="mr-2" />
            <span>Insert Default General Conditions</span>
          </Button>
          <Button
            size="sm"
            variant={'outline'}
            onClick={() => store.setNested('createDto.generalConditions', '{}')}>
            <BrushCleaning className="mr-2" />
            <span>Clear General Conditions</span>
          </Button>
        </div>
      )
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

  const attachmentsField: Field<MultipleFilesFieldProps> = {
    id: 'attachments',
    variant: FieldVariant.FILES,
    props: {
      files: store.files,
      onFilesChange: (files) => {
        store.set('files', files);
      },
      onUpload: onAttachmentsUpload
    }
  };

  const notesField: Field<EditorFieldProps> = {
    id: 'notes',
    variant: FieldVariant.EDITOR,
    props: {
      value: store.createDto.notes,
      onChange: (value) => {
        store.setNested('createDto.notes', value);
        store.setNested('createDtoErrors.notes', []);
      }
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
                    },
                    {
                      fields: [defaultGeneralConditionsActionsField]
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

  const sequenceField: Field<TextFieldProps> = {
    id: 'sequence',
    label: t('quotation.form.sequence', { defaultValue: 'Sequence' }),
    description: t('quotation.form.descriptions.sequence', { defaultValue: 'Auto-generated sequence' }),
    variant: FieldVariant.TEXT,
    required: false,
    props: {
      disabled: true,
      value: store.sequencePreview || 'Loading...'
    }
  };

  const mainFormStructure: FormStructure = {
    title: {
      value: 'General Information'
    },
    toggleableFieldsets: true,
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
            fields: [objectField, sequenceField]
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
          value: 'Attachments'
        },
        includeHeader: true,
        rows: [
          {
            fields: [attachmentsField]
          }
        ]
      },
      {
        title: {
          value: 'Notes'
        },
        includeHeader: true,
        rows: [
          {
            fields: [notesField]
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
