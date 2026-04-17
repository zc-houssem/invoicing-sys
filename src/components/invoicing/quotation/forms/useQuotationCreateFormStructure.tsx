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
import { Button } from '@/components/ui/button';
import { QuotationStore } from '@/hooks/stores/useQuotationStore';
import { Check, Save, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface useQuotationCreateFormStructureProps {
  store: QuotationStore;
  enterpriseOptions: SelectOption[];
  interlocutorOptions: SelectOption[];
  createQuotation: () => void;
  isCreationPending: boolean;
}

export const useQuotationCreateFormStructure = ({
  store,
  enterpriseOptions,
  interlocutorOptions,
  createQuotation,
  isCreationPending
}: useQuotationCreateFormStructureProps) => {
  const { t } = useTranslation('invoicing');

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
        store.setNested('createDto.interlocutorId', undefined);
        store.setNested('createDtoErrors.interlocutorId', []);
        store.setNested('createDto.enterpriseId', Number(value));
        store.setNested('createDtoErrors.enterpriseId', []);
      },
      options: enterpriseOptions
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

  const mainFormStructure: FormStructure = {
    title: {
      value: 'Create Quotation'
    },
    orientation: 'horizontal',
    fieldsets: [
      {
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
            fields: [generalConditionsField]
          }
        ]
      }
    ]
  };

  //*************************************************************************************************************************** */

  const statusField: Field<CustomFieldProps> = {
    id: 'status',
    label: '',
    variant: FieldVariant.CUSTOM,
    props: {
      children: (
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold">Status:</span>
          <span className="text-muted-foreground font-semibold">New</span>
        </div>
      )
    }
  };

  const buttonsField: Field<CustomFieldProps> = {
    id: 'saveButton',
    label: '',
    variant: FieldVariant.CUSTOM,
    props: {
      children: (
        <div className="flex flex-col gap-2 w-full">
          <Button
            type="button"
            variant={'outline'}
            onClick={() => {
              createQuotation();
            }}>
            <span>Save</span>
            <Save className="size-10" />
          </Button>
          <Button variant={'secondary'} onClick={() => {}}>
            <span>Validate</span>
            <Check className="size-10" />
          </Button>
          <Button variant={'secondary'} onClick={() => {}}>
            <span>Send</span>
            <Send className="size-10" />
          </Button>
        </div>
      )
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
            fields: [statusField]
          },
          {
            fields: [buttonsField]
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
