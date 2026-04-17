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

interface useQuotationUpdateFormStructureProps {
  store: QuotationStore;
  enterpriseOptions: SelectOption[];
  interlocutorOptions: SelectOption[];
  updateQuotation: () => void;
  isUpdatePending: boolean;
}

export const useQuotationUpdateFormStructure = ({
  store,
  enterpriseOptions,
  interlocutorOptions,
  updateQuotation,
  isUpdatePending
}: useQuotationUpdateFormStructureProps) => {
  const { t } = useTranslation('invoicing');

  const singleFileField: Field<SingleFileFieldProps> = {
    id: 'file',
    label: 'Document',
    variant: FieldVariant.FILE,
    hidden: store.updateDto?.direction === 'outgoing',
    props: {
      // value: store.updateDto.file,
      // onChange: (file) => store.setNested('updateDto.file', file)
    }
  };

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: t('quotation.form.date'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.updateDtoErrors.date?.[0],
    placeholder: t('quotation.form.placeholders.date'),
    description: t('quotation.form.descriptions.date'),
    props: {
      disabled: isUpdatePending,
      value: store.updateDto?.date,
      onDateChange: (date) => {
        store.setNested('updateDto.date', date);
        store.setNested('updateDtoErrors.date', []);
      }
    }
  };

  const dueDateField: Field<DateFieldProps> = {
    id: 'dueDate',
    label: t('quotation.form.dueDate'),
    variant: FieldVariant.DATE,
    required: true,
    error: store.updateDtoErrors.dueDate?.[0],
    placeholder: t('quotation.form.placeholders.dueDate'),
    description: t('quotation.form.descriptions.dueDate'),
    props: {
      disabled: isUpdatePending,
      value: store.updateDto?.dueDate,
      onDateChange: (date) => {
        store.setNested('updateDto.dueDate', date);
        store.setNested('updateDtoErrors.dueDate', []);
      }
    }
  };

  const objectField: Field<TextFieldProps> = {
    id: 'object',
    label: t('quotation.form.object'),
    variant: FieldVariant.TEXT,
    required: true,
    error: store.updateDtoErrors.object?.[0],
    placeholder: t('quotation.form.placeholders.object'),
    description: t('quotation.form.descriptions.object'),
    props: {
      disabled: isUpdatePending,
      value: store.updateDto?.object,
      onChange: (value) => {
        store.setNested('updateDto.object', value);
        store.setNested('updateDtoErrors.object', []);
      }
    }
  };

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: t('quotation.form.enterprise'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.enterpriseId?.[0],
    placeholder: t('quotation.form.placeholders.enterprise'),
    description: t('quotation.form.descriptions.enterprise'),
    pending: !(enterpriseOptions && store.updateDto?.enterpriseId),
    props: {
      disabled: isUpdatePending,
      value: store.updateDto?.enterpriseId ? store.updateDto.enterpriseId.toString() : undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.enterpriseId', Number(value));
        store.setNested('updateDtoErrors.enterpriseId', []);
        store.setNested('updateDto.interlocutorId', undefined);
        store.setNested('updateDtoErrors.interlocutorId', []);
      },
      options: enterpriseOptions
    }
  };

  const interlocutorField: Field<SelectFieldProps> = {
    id: 'interlocutor',
    label: t('quotation.form.interlocutor'),
    variant: FieldVariant.SELECT,
    required: true,
    error: store.updateDtoErrors.interlocutorId?.[0],
    placeholder: t('quotation.form.placeholders.interlocutor'),
    description: t('quotation.form.descriptions.interlocutor'),
    pending: !(interlocutorOptions && store.updateDto?.enterpriseId),
    props: {
      disabled: isUpdatePending || !store.updateDto?.enterpriseId,
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
    label: t('quotation.form.generalConditions'),
    variant: FieldVariant.EDITOR,
    required: true,
    error: store.updateDtoErrors.generalConditions?.[0],
    placeholder: t('quotation.form.placeholders.generalConditions'),
    description: t('quotation.form.descriptions.generalConditions'),
    pending: !store.updateDto?.generalConditions,
    props: {
      value: store.updateDto?.generalConditions,
      onChange: (value) => {
        store.setNested('updateDto.generalConditions', value);
        store.setNested('updateDtoErrors.generalConditions', []);
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
            variant={'default'}
            onClick={() => {
              updateQuotation();
            }}>
            <span>Save</span>
            <Save className="size-10" />
          </Button>
          <Button variant={'outline'} onClick={() => {}}>
            <span>Validate</span>
            <Check className="size-10" />
          </Button>
          <Button variant={'outline'} onClick={() => {}}>
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
