import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import {
  FieldVariant,
  FormStructure,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
} from '@/components/shared/form-builder/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DateFormat, UpdateSequentialDto } from '@/types';

interface SequenceItemProps {
  className?: string;
  id?: number;
  title: string;
  prefix?: string;
  dateFormat?: DateFormat;
  nextNumber?: number;
  padding?: number;
  loading?: boolean;
  onSequenceChange?: (fieldname: keyof UpdateSequentialDto, value: any) => void;
}

export const SequenceItem = ({
  className,
  title,
  prefix,
  dateFormat,
  nextNumber,
  padding,
  loading,
  onSequenceChange
}: SequenceItemProps) => {
  const { t: tSettings } = useTranslation('settings');

  const structure: FormStructure = {
    fieldsets: [
      {
        rows: [
          {
            fields: [
              {
                id: 'prefix',
                label: tSettings('sequence.attributes.prefix.label'),
                description: tSettings('sequence.attributes.prefix.description'),
                placeholder: tSettings('sequence.attributes.prefix.placeholder'),
                variant: FieldVariant.TEXT,
                props: {
                  value: prefix || '',
                  onChange: (val: string) => onSequenceChange?.('prefix', val),
                  disabled: loading
                } as TextFieldProps
              },
              {
                id: 'padding',
                label: tSettings('sequence.attributes.padding.label'),
                description: tSettings('sequence.attributes.padding.description'),
                placeholder: tSettings('sequence.attributes.padding.placeholder'),
                variant: FieldVariant.NUMBER,
                props: {
                  value: padding || 0,
                  onChange: (val: number) => onSequenceChange?.('padding', val),
                  disabled: loading,
                  min: 0,
                  max: 20
                } as NumberFieldProps
              }
            ]
          },
          {
            fields: [
              {
                id: 'dateFormat',
                label: tSettings('sequence.attributes.dynamic_sequence.label'),
                description: tSettings('sequence.attributes.dynamic_sequence.description'),
                placeholder: tSettings('sequence.attributes.dynamic_sequence.placeholder'),
                variant: FieldVariant.SELECT,
                props: {
                  value: dateFormat || DateFormat.YYYYMM,
                  options: [
                    { label: 'yyyy', value: DateFormat.YYYY },
                    { label: 'yy/MM', value: DateFormat.YYMM },
                    { label: 'yyyy/MM', value: DateFormat.YYYYMM }
                  ],
                  onValueChange: (val: string) =>
                    onSequenceChange?.('dateFormat', val as DateFormat),
                  disabled: loading
                } as SelectFieldProps
              },
              {
                id: 'next',
                label: tSettings('sequence.attributes.next.label'),
                description: tSettings('sequence.attributes.next.description'),
                placeholder: tSettings('sequence.attributes.next.placeholder'),
                variant: FieldVariant.NUMBER,
                props: {
                  value: nextNumber || 0,
                  onChange: (val: number) => onSequenceChange?.('nextValue', val),
                  disabled: loading,
                  min: 0
                } as NumberFieldProps
              }
            ]
          }
        ]
      }
    ]
  };

  return (
    <Card className={cn('shadow-sm transition-all hover:shadow-md', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription>{tSettings('sequence.card_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={structure} />
      </CardContent>
    </Card>
  );
};
