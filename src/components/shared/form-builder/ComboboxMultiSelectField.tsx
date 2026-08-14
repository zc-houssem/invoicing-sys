import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { cn } from '@/lib/utils';
import { SelectOption } from './types';

interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxMultiSelectFieldProps {
  options?: SelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboboxMultiSelectField({
  options = [],
  value = [],
  onValueChange,
  placeholder,
  disabled,
  className
}: ComboboxMultiSelectFieldProps) {
  const { t } = useTranslation('common');
  const anchorRef = useComboboxAnchor();

  const items = React.useMemo<ComboboxItem[]>(
    () => options.map((option) => ({ label: option.label, value: option.value })),
    [options]
  );

  const selectedItems = React.useMemo(
    () => items.filter((item) => value.includes(item.value)),
    [items, value]
  );

  return (
    <Combobox
      items={items}
      multiple
      disabled={disabled}
      value={selectedItems}
      onValueChange={(nextItems) => onValueChange?.(nextItems.map((item) => item.value))}
      isItemEqualToValue={(item, selected) => item.value === selected.value}>
      <ComboboxChips ref={anchorRef} className={cn('w-full', className)}>
        <ComboboxValue>
          {(values: ComboboxItem[]) => (
            <>
              {values.map((item) => (
                <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                disabled={disabled}
                placeholder={values.length === 0 ? placeholder : undefined}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>{t('table.no_results')}</ComboboxEmpty>
        <ComboboxList>
          {(item: ComboboxItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
