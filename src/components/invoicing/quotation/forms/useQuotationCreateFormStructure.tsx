import {
  CustomFieldProps,
  DateFieldProps,
  EditorFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SingleFileFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { Button } from '@/components/ui/button';
import { QuotationStore } from '@/hooks/stores/useQuotationStore';
import { Check, Save, Send } from 'lucide-react';

interface useQuotationCreateFormStructureProps {
  store: QuotationStore;
  createQuotation: () => void;
  isCreationPending: boolean;
}

export const useQuotationCreateFormStructure = ({
  store,
  createQuotation,
  isCreationPending
}: useQuotationCreateFormStructureProps) => {
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
    label: 'Date',
    variant: FieldVariant.DATE,
    required: true,
    error: store.createDtoErrors.date?.[0],
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
    label: 'Due Date',
    variant: FieldVariant.DATE,
    required: true,
    error: store.createDtoErrors.dueDate?.[0],
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
    label: 'Object',
    variant: FieldVariant.TEXT,
    required: true,
    error: store.createDtoErrors.object?.[0],
    props: {
      disabled: isCreationPending,
      value: store.createDto.object,
      onChange: (value) => {
        store.setNested('createDto.object', value);
        store.setNested('createDtoErrors.object', []);
      }
    }
  };

  const generalConditionsField: Field<EditorFieldProps> = {
    id: 'generalConditions',
    label: 'General Conditions',
    variant: FieldVariant.EDITOR,
    required: true,
    error: store.createDtoErrors.generalConditions?.[0],
    props: {
      value: store.createDto.generalConditions,
      onChange: (value) => {
        store.setNested('createDto.generalConditions', value.toString());
        store.setNested('createDtoErrors.generalConditions', []);
      }
    }
  };

  const mainFormStructure: FormStructure = {
    title: 'Create Quotation',
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
            <span>Save as draft</span>
            <Save className="size-10" />
          </Button>
          <Button variant={'secondary'} onClick={() => {}}>
            <span>Save & Validate</span>
            <Check className="size-10" />
          </Button>
          <Button variant={'secondary'} onClick={() => {}}>
            <span>Save & Send</span>
            <Send className="size-10" />
          </Button>
        </div>
      )
    }
  };

  const sidebarFormStructure: FormStructure = {
    title: 'Sidebar',
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
