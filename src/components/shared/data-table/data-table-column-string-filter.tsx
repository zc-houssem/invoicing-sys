import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  buildColumnFilter,
  DATA_TABLE_STRING_FILTER_OPERATORS,
  DataTableStringFilterOperator,
  parseColumnFilter
} from './column-filter';

interface DataTableColumnStringFilterProps {
  filterField: string;
  filterKey: string;
  activeFilter?: string;
  onApply: (filterKey: string, filterParam: string | null) => void;
}

export function DataTableColumnStringFilter({
  filterField,
  filterKey,
  activeFilter,
  onApply
}: DataTableColumnStringFilterProps) {
  const { t } = useTranslation('common');
  const parsedFilter = activeFilter ? parseColumnFilter(activeFilter) : null;

  const [operator, setOperator] = React.useState<DataTableStringFilterOperator>(
    parsedFilter?.operator ?? '$eq'
  );
  const [value, setValue] = React.useState(parsedFilter?.value ?? '');

  React.useEffect(() => {
    const parsed = activeFilter ? parseColumnFilter(activeFilter) : null;
    if (parsed) {
      setOperator(parsed.operator);
      setValue(parsed.value);
      return;
    }

    setOperator('$eq');
    setValue('');
  }, [activeFilter]);

  const handleApply = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      onApply(filterKey, null);
      return;
    }

    onApply(filterKey, buildColumnFilter(filterField, operator, trimmedValue));
  };

  return (
    <div
      className="space-y-2 p-2"
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <Select
        value={operator}
        onValueChange={(nextOperator) =>
          setOperator(nextOperator as DataTableStringFilterOperator)
        }>
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DATA_TABLE_STRING_FILTER_OPERATORS.map((filterOperator) => (
            <SelectItem key={filterOperator} value={filterOperator}>
              {t(`datatable.filter.operators.${filterOperator}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('datatable.filter.valuePlaceholder')}
        className="h-8"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleApply();
          }
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleApply}>
          {t('commands.apply')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={!activeFilter}
          onClick={() => onApply(filterKey, null)}>
          {t('datatable.filter.clear')}
        </Button>
      </div>
    </div>
  );
}
