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
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { InvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { CurrencyPayload, ResponseEnterpriseDto, ResponseRefParamDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { InvoiceArticlesField } from './InvoiceArticlesField';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { ArticleResume } from '../../articles/ArticleResume';
import { api } from '@/api';

interface useInvoiceUpdateFormStructureProps {
  store: InvoiceStore;
  enterprises: ResponseEnterpriseDto[];
  interlocutorOptions: SelectOption[];
  currencyOptions: SelectOption[];
  taxWithholdingOptions: SelectOption[];
  bankAccountOptions: SelectOption[];
  isUpdatePending: boolean;
  selectedCurrency?: ResponseRefParamDto<CurrencyPayload>;
  isUpdatable: boolean;
  onAttachmentsUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void>;
}

export const useInvoiceUpdateFormStructure = ({
  store,
  enterprises,
  interlocutorOptions,
  currencyOptions,
  taxWithholdingOptions,
  bankAccountOptions,
  isUpdatePending,
  selectedCurrency,
  isUpdatable,
  onAttachmentsUpload
}: useInvoiceUpdateFormStructureProps) => {
  const enterpriseStore = useEnterpriseStore();
  const { t } = useTranslation('invoicing');
  const { t: tContacts } = useTranslation('contacts');

  const singleFileField: Field<SingleFileFieldProps> = {
    id: 'file',
    label: 'Document',
    variant: FieldVariant.FILE,
    hidden: store.updateDto?.direction === 'outgoing',
    props: {}
  };

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: t('invoice.form.date'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.updateDtoErrors.date?.[0],
    placeholder: t('invoice.form.placeholders.date'),
    description: t('invoice.form.descriptions.date'),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.date,
      onDateChange: (date) => {
        store.setNested('updateDto.date', date);
        store.setNested('updateDtoErrors.date', []);
      }
    }
  };

  const dueDateField: Field<DateFieldProps> = {
    id: 'dueDate',
    label: t('invoice.form.dueDate'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.updateDtoErrors.dueDate?.[0],
    placeholder: t('invoice.form.placeholders.dueDate'),
    description: t('invoice.form.descriptions.dueDate'),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.dueDate,
      onDateChange: (date) => {
        store.setNested('updateDto.dueDate', date);
        store.setNested('updateDtoErrors.dueDate', []);
      }
    }
  };

  const objectField: Field<TextFieldProps> = {
    id: 'object',
    label: t('invoice.form.object'),
    variant: FieldVariant.TEXT,
    required: true,
    error: store.updateDtoErrors.object?.[0],
    placeholder: t('invoice.form.placeholders.object'),
    description: t('invoice.form.descriptions.object'),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.object,
      onChange: (value) => {
        store.setNested('updateDto.object', value);
        store.setNested('updateDtoErrors.object', []);
      }
    }
  };

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: t('invoice.form.enterprise'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.enterpriseId?.[0],
    placeholder: t('invoice.form.placeholders.enterprise'),
    description: t('invoice.form.descriptions.enterprise'),
    pending: !(enterprises && store.updateDto?.enterpriseId),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.enterpriseId ? store.updateDto.enterpriseId.toString() : undefined,
      onValueChange: (value) => {
        const numericValue = Number(value);

        store.setNested('updateDto.enterpriseId', numericValue);
        store.setNested('updateDtoErrors.enterpriseId', []);
        store.setNested('updateDto.interlocutorId', undefined);
        store.setNested('updateDtoErrors.interlocutorId', []);

        const enterprise = enterprises.find((ent) => ent.id === numericValue);
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
    label: t('invoice.form.interlocutor'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.interlocutorId?.[0],
    placeholder: t('invoice.form.placeholders.interlocutor'),
    description: t('invoice.form.descriptions.interlocutor'),
    pending: !(interlocutorOptions && store.updateDto?.enterpriseId),
    props: {
      disabled: isUpdatePending || !store.updateDto?.enterpriseId || !isUpdatable,
      value: store.updateDto?.interlocutorId
        ? store.updateDto.interlocutorId.toString()
        : undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.interlocutorId', Number(value));
        store.setNested('updateDtoErrors.interlocutorId', []);
      },
      options: interlocutorOptions
    }
  };

  const generalConditionsField: Field<EditorFieldProps> = {
    id: 'generalConditions',
    label: t('invoice.form.generalConditions'),
    variant: FieldVariant.EDITOR,
    required: true,
    error: store.updateDtoErrors.generalConditions?.[0],
    placeholder: t('invoice.form.placeholders.generalConditions'),
    description: t('invoice.form.descriptions.generalConditions'),
    pending: !store.updateDto?.generalConditions,
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.generalConditions,
      onChange: (value) => {
        store.setNested('updateDto.generalConditions', value);
        store.setNested('updateDtoErrors.generalConditions', []);
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
      children: (
        <InvoiceArticlesField
          currency={selectedCurrency}
          disabled={isUpdatePending || !isUpdatable}
        />
      )
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
      onUpload: onAttachmentsUpload,
      onFileOpen: (file) => {
        api.core.storage.openFileById(file.serverId as number, '*/*');
      },
      onFileDownload: (file) => {
        api.core.storage.downloadFileById(file.serverId as number, file.name);
      }
    }
  };

  const notesField: Field<EditorFieldProps> = {
    id: 'notes',
    variant: FieldVariant.EDITOR,
    props: {
      value: store.updateDto?.notes,
      onChange: (value) => {
        store.setNested('updateDto.notes', value);
        store.setNested('updateDtoErrors.notes', []);
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
    label: t('invoice.form.currency'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.currencyId?.[0],
    placeholder: t('invoice.form.placeholders.currency'),
    description: t('invoice.form.descriptions.currency'),
    pending: !store.updateDto?.currencyId,
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.currencyId ? store.updateDto.currencyId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.currencyId', Number(value));
        store.setNested('updateDtoErrors.currencyId', []);
      },
      options: currencyOptions
    }
  };

  const bankAccountField: Field<SelectFieldProps> = {
    id: 'bankAccount',
    label: t('invoice.form.bankAccount'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.bankAccountId?.[0],
    placeholder: t('invoice.form.placeholders.bankAccount'),
    description: t('invoice.form.descriptions.bankAccount'),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.bankAccountId ? store.updateDto.bankAccountId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.bankAccountId', Number(value));
        store.setNested('updateDtoErrors.bankAccountId', []);
      },
      options: bankAccountOptions
    }
  };

  const taxWithholdingField: Field<SelectFieldProps> = {
    id: 'taxWithholding',
    label: t('invoice.form.taxWithholding'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.taxWithholdingId?.[0],
    placeholder: t('invoice.form.placeholders.taxWithholding'),
    description: t('invoice.form.descriptions.taxWithholding'),
    props: {
      disabled: isUpdatePending || !isUpdatable,
      value: store.updateDto?.taxWithholdingId
        ? store.updateDto.taxWithholdingId.toString()
        : undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.taxWithholdingId', Number(value));
        store.setNested('updateDtoErrors.taxWithholdingId', []);
      },
      options: taxWithholdingOptions
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
          },
          {
            fields: [taxWithholdingField]
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
