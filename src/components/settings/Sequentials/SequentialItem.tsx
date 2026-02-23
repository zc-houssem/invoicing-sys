import { DateFormat } from '@/types/enums/date-formats';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UpdateSequentialDto } from '@/types';

interface SequentialItemProps {
  className?: string;
  id?: number;
  title: string;
  prefix?: string;
  dateFormat?: DateFormat;
  nextNumber?: number;
  loading?: boolean;
  onSequenceChange?: (fieldname: keyof UpdateSequentialDto, value: any) => void;
}

export const SequentialItem: React.FC<SequentialItemProps> = ({
  className,
  title,
  prefix,
  dateFormat,
  nextNumber,
  loading,
  onSequenceChange
}) => {
  const { t: tSettings } = useTranslation('settings');

  const sequenceOptions = {
    [DateFormat.YYYY]: 'yyyy',
    [DateFormat.YYMM]: 'yy-MM',
    [DateFormat.YYYYMM]: 'yyyy-MM'
  };

  return (
    <Card className={cn('border-none', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label className="text-sm my-1">{tSettings('sequence.attributes.prefix')} :</Label>
          <Input
            value={prefix}
            onChange={(e) => {
              onSequenceChange?.('prefix', e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <Label className="text-sm my-1">
            {tSettings('sequence.attributes.dynamic_sequence')} :
          </Label>
          <Select
            value={sequenceOptions[dateFormat || DateFormat.YYYY]}
            onValueChange={(value) => {
              onSequenceChange?.('dateFormat', value);
            }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sequenceOptions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4">
          <Label className="text-sm my-1">{tSettings('sequence.attributes.next')} :</Label>
          <Input
            type="number"
            value={nextNumber}
            onChange={(e) => {
              onSequenceChange?.('next', parseInt(e.target.value));
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
