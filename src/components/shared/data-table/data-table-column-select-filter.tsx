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
import { DataTableColumnComboboxFilter } from './data-table-column-combobox-filter';

interface DataTableColumnSelectFilterProps {
  filterKey: string;
  activeFilter?: string;
  options: DataTableColumnFilterOption[];
  multiSelect?: boolean;
  onApply: (filterKey: string, filterParam: string | null) => void;
  onClose?: () => void;
}

export function DataTableColumnSelectFilter({
  filterKey,
  activeFilter,
  options,
  multiSelect = false,
  onApply,
  onClose
}: DataTableColumnSelectFilterProps) {
  const { t } = useTranslation('common');
  const [pendingValue, setPendingValue] = React.useState(activeFilter ?? '');

  React.useEffect(() => {
    setPendingValue(activeFilter ?? '');
  }, [activeFilter]);

  if (multiSelect) {
    return (
      <DataTableColumnComboboxFilter
        filterKey={filterKey}
        activeFilter={activeFilter}
        options={options}
        onApply={onApply}
        onClose={onClose}
      />
    );
  }

  const handleConfirm = () => {
    onApply(filterKey, pendingValue || null);
    onClose?.();
  };

  const handleClear = () => {
    setPendingValue('');
    onApply(filterKey, null);
    onClose?.();
  };

  return (
    <div
      className="space-y-2 p-2"
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <Select value={pendingValue} onValueChange={setPendingValue}>
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
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleConfirm}>
          {t('commands.confirm')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={!activeFilter && !pendingValue}
          onClick={handleClear}>
          {t('datatable.filter.clear')}
        </Button>
      </div>
    </div>
  );
}
