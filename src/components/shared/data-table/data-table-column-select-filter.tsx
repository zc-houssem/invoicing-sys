import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTableColumnFilterOption } from './types';

interface DataTableColumnSelectFilterProps {
  filterKey: string;
  activeFilter?: string;
  options: DataTableColumnFilterOption[];
  onApply: (filterKey: string, filterParam: string | null) => void;
  onClose?: () => void;
}

export function DataTableColumnSelectFilter({
  filterKey,
  activeFilter,
  options,
  onApply,
  onClose
}: DataTableColumnSelectFilterProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className="space-y-2 p-2"
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <Select
        value={activeFilter ?? ''}
        onValueChange={(value) => {
          onApply(filterKey, value || null);
          onClose?.();
        }}>
        <SelectTrigger className="h-8">
          <SelectValue placeholder={t('datatable.filter.selectPlaceholder')} />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {options.map((option) => (
            <SelectItem key={option.filter} value={option.filter}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        disabled={!activeFilter}
        onClick={() => {
          onApply(filterKey, null);
          onClose?.();
        }}>
        {t('datatable.filter.clear')}
      </Button>
    </div>
  );
}
