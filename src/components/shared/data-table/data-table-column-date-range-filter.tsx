import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { buildDateRangeFilter, parseDateRangeFilter } from './column-filter';

interface DataTableColumnDateRangeFilterProps {
  filterField: string;
  filterKey: string;
  activeFilter?: string;
  onApply: (filterKey: string, filterParam: string | null) => void;
  onClose?: () => void;
}

export function DataTableColumnDateRangeFilter({
  filterField,
  filterKey,
  activeFilter,
  onApply,
  onClose
}: DataTableColumnDateRangeFilterProps) {
  const { t } = useTranslation('common');
  const parsed = activeFilter ? parseDateRangeFilter(activeFilter) : null;

  const [from, setFrom] = React.useState(parsed?.from ?? '');
  const [to, setTo] = React.useState(parsed?.to ?? '');

  React.useEffect(() => {
    const p = activeFilter ? parseDateRangeFilter(activeFilter) : null;
    setFrom(p?.from ?? '');
    setTo(p?.to ?? '');
  }, [activeFilter]);

  const handleApply = () => {
    const trimmedFrom = from.trim() || undefined;
    const trimmedTo = to.trim() || undefined;
    const filter = buildDateRangeFilter(filterField, trimmedFrom, trimmedTo);
    onApply(filterKey, filter);
    onClose?.();
  };

  return (
    <div
      className="space-y-2 p-2"
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <div className="space-y-1">
        <Label className="text-xs">{t('datatable.filter.dateFrom')}</Label>
        <DatePicker
          value={from}
          onChange={(date) => {
            if (date) {
              setFrom(format(date as Date, 'yyyy-MM-dd'));
            } else {
              setFrom('');
            }
          }}
          className="h-8"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleApply();
            }
          }}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('datatable.filter.dateTo')}</Label>
        <DatePicker
          value={to}
          onChange={(date) => {
            if (date) {
              setTo(format(date as Date, 'yyyy-MM-dd'));
            } else {
              setTo('');
            }
          }}
          className="h-8"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleApply();
            }
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleApply}>
          {t('commands.apply')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={!activeFilter}
          onClick={() => {
            onApply(filterKey, null);
            onClose?.();
          }}>
          {t('datatable.filter.clear')}
        </Button>
      </div>
    </div>
  );
}
