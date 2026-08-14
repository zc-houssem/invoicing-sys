import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combo-box';
import {
  buildMultiOptionFilter,
  getOptionFilterField,
  getOptionFilterValue,
  getSelectedOptionFilterValues
} from './column-filter';
import { DataTableColumnFilterOption } from './types';

interface ComboboxFilterItem {
  label: string;
  value: string;
  filter: string;
}

interface DataTableColumnComboboxFilterProps {
  filterKey: string;
  activeFilter?: string;
  options: DataTableColumnFilterOption[];
  onApply: (filterKey: string, filterParam: string | null) => void;
  onClose?: () => void;
}

export function DataTableColumnComboboxFilter({
  filterKey,
  activeFilter,
  options,
  onApply,
  onClose
}: DataTableColumnComboboxFilterProps) {
  const { t } = useTranslation('common');
  const anchorRef = useComboboxAnchor();

  const items = React.useMemo(
    () =>
      options
        .map((option) => {
          const value = getOptionFilterValue(option);
          if (!value) return null;
          return { label: option.label, value, filter: option.filter };
        })
        .filter(Boolean) as ComboboxFilterItem[],
    [options]
  );

  const appliedItems = React.useMemo(() => {
    const selectedValues = getSelectedOptionFilterValues(activeFilter);
    return items.filter((item) => selectedValues.includes(item.value));
  }, [activeFilter, items]);

  const [draftItems, setDraftItems] = React.useState<ComboboxFilterItem[]>(appliedItems);

  React.useEffect(() => {
    setDraftItems(appliedItems);
  }, [appliedItems]);

  const handleConfirm = () => {
    const field = getOptionFilterField(options);
    if (!field) return;

    const values = draftItems.map((item) => item.value);
    onApply(filterKey, buildMultiOptionFilter(field, values));
    onClose?.();
  };

  const handleClear = () => {
    setDraftItems([]);
    onApply(filterKey, null);
    onClose?.();
  };

  return (
    <div
      className="space-y-2 p-2"
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <Combobox
        items={items}
        multiple
        value={draftItems}
        onValueChange={setDraftItems}
        isItemEqualToValue={(item, selected) => item.value === selected.value}>
        <ComboboxChips ref={anchorRef} className="w-full">
          <ComboboxValue>
            {(values: ComboboxFilterItem[]) => (
              <>
                {values.map((item) => (
                  <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={t('datatable.filter.selectPlaceholder')} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxEmpty>{t('datatable.noResults')}</ComboboxEmpty>
          <ComboboxList>
            {(item: ComboboxFilterItem) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleConfirm}>
          {t('commands.confirm')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={draftItems.length === 0 && !activeFilter}
          onClick={handleClear}>
          {t('datatable.filter.clear')}
        </Button>
      </div>
    </div>
  );
}
