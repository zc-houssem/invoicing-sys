import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { JSONValue } from '@/components/shared/JsonEditor';
import { JSONExtras } from '@/components/shared/JSONExtras';
import { ReferenceTypesStore } from '@/hooks/stores/useReferenceTypesStore';

interface RefTypeUpdateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
  refTypesOptions?: SelectOption[];
}
export const useUpdateRefTypeFormStructure = ({
  referenceTypesStore,
  refTypesOptions
}: RefTypeUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: 'label',
    label: 'Label',
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: 'Ex. Currency',
    description: "Reference Type's label.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.label?.[0],
    props: {
      value: referenceTypesStore?.refTypeUpdateDto.label || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested('refTypeUpdateDto.label', value);
        referenceTypesStore?.setNested('refTypeUpdateDtoErrors.label', []);
      }
    }
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: 'description',
    label: 'Description',
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: 'Ex. Currency RefType is a type that allows you to manage currencies.',
    description: "Reference Type's description.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.description?.[0],
    props: {
      value: referenceTypesStore?.refTypeUpdateDto.description || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested('refTypeUpdateDto.description', value);
        referenceTypesStore?.setNested('refTypeUpdateDtoErrors.description', []);
      },
      rows: 7
    }
  };

  const refTypeField: Field<SelectFieldProps> = {
    id: 'refTypeId',
    label: 'Reference Type',
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: 'Select a reference type',
    description: "Reference Type's reference parameter.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.refTypeId?.[0],
    props: {
      options: refTypesOptions,
      value: referenceTypesStore?.refTypeUpdateDto.parentId?.toString(),
      onValueChange: (value) => {
        referenceTypesStore?.setNested('refTypeUpdateDto.parentId', value);
        referenceTypesStore?.setNested('refTypeUpdateDtoErrors.parentId', []);
      }
    }
  };

  const extrasField: Field<CustomFieldProps> = {
    id: 'extras',
    label: 'Extras',
    variant: FieldVariant.CUSTOM,
    description: "Reference Type's extras.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.extras?.[0],
    props: {
      children: (
        <JSONExtras
          value={referenceTypesStore?.refTypeUpdateDto.extras as JSONValue}
          onChange={(value) => {
            referenceTypesStore?.setNested('refTypeUpdateDto.extras', value);
            referenceTypesStore?.setNested('refTypeUpdateDtoErrors.extras', []);
          }}
        />
      )
    }
  };

  const refTypeUpdateFormStructure: FormStructure = {
    title: {
      value: 'Update Reference Type'
    },
    description: {
      value: 'Update an existing reference type.'
    },
    fieldsets: [
      {
        title: {
          value: 'Update Reference Type'
        },
        description: {
          value: 'Update an existing reference type.'
        },
        rows: [
          {
            fields: [labelField]
          },
          {
            fields: [refTypeField]
          },
          {
            fields: [descriptionField]
          },
          {
            fields: [extrasField]
          }
        ]
      }
    ]
  };

  return {
    refTypeUpdateFormStructure
  };
};
