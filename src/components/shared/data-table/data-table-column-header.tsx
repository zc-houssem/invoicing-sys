import React from 'react';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, Filter } from 'lucide-react';
import { CaretSortIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { DataTableColumnFilterOption, DataTableColumnFilterType, DataTableConfig } from './types';
import { DataTableColumnStringFilter } from './data-table-column-string-filter';
import { DataTableColumnSelectFilter } from './data-table-column-select-filter';
import { DataTableColumnDateRangeFilter } from './data-table-column-date-range-filter';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  attribute?: string;
  context: DataTableConfig<TData>;
  filterKey?: string;
  filterField?: string;
  filterType?: DataTableColumnFilterType;
  filterOptions?: DataTableColumnFilterOption[];
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  attribute,
  className,
  context,
  filterKey,
  filterField,
  filterType,
  filterOptions
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation('common');
  const meta = column.columnDef.meta;

  const resolvedFilterKey = filterKey ?? meta?.filterKey ?? attribute;
  const resolvedFilterField = filterField ?? meta?.filterField ?? resolvedFilterKey;
  const resolvedFilterOptions = filterOptions ?? meta?.filterOptions;
  const resolvedFilterType =
    filterType ?? meta?.filterType ?? (resolvedFilterOptions?.length ? 'options' : undefined);

  const canFilterOptions =
    resolvedFilterType === 'options' &&
    Boolean(resolvedFilterKey) &&
    Boolean(resolvedFilterOptions?.length) &&
    Boolean(context.setColumnFilter);
  const canFilterString =
    resolvedFilterType === 'string' &&
    Boolean(resolvedFilterKey) &&
    Boolean(resolvedFilterField) &&
    Boolean(context.setColumnFilter);
  const canFilterSelect =
    resolvedFilterType === 'select' &&
    Boolean(resolvedFilterKey) &&
    Boolean(resolvedFilterOptions?.length) &&
    Boolean(context.setColumnFilter);
  const canFilterDateRange =
    resolvedFilterType === 'date-range' &&
    Boolean(resolvedFilterKey) &&
    Boolean(resolvedFilterField) &&
    Boolean(context.setColumnFilter);
  const canFilter = canFilterOptions || canFilterString || canFilterSelect || canFilterDateRange;

  const [isOpen, setIsOpen] = React.useState(false);

  const activeFilter = resolvedFilterKey ? context.columnFilters?.[resolvedFilterKey] : undefined;
  const isFilterActive = Boolean(activeFilter);
  const isSorted = attribute != null && context.sortKey === attribute;
  const canSort = column.getCanSort();

  if (!canSort && !canFilter) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-center data-[state=open]:bg-accent -ml-3',
              isFilterActive && 'text-primary'
            )}>
            <span className="text-xs">{title}</span>
            {canSort && context.order === true && isSorted ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : canSort && context.order === false && isSorted ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : isFilterActive ? (
              <Filter className="ml-2 h-4 w-4" />
            ) : canSort ? (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            ) : (
              <Filter className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56"
          onInteractOutside={(e) => {
            const target = e.target as Element;
            // Prevent closing if interacting with the date picker's popover (dialog)
            if (target?.closest('[role="dialog"]') || target?.closest('.rdp')) {
              e.preventDefault();
            }
          }}>
          {canSort && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  if (attribute) context?.setSortDetails?.(false, attribute);
                }}>
                <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t('datatable.order.asc')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (attribute) context?.setSortDetails?.(true, attribute);
                }}>
                <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t('datatable.order.desc')}
              </DropdownMenuItem>
            </>
          )}
          {canSort && canFilter && <DropdownMenuSeparator />}
          {canFilterOptions && resolvedFilterKey && resolvedFilterOptions && (
            <>
              <DropdownMenuLabel>{t('datatable.filter.title')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={activeFilter}
                onValueChange={(value) => context.setColumnFilter?.(resolvedFilterKey, value)}>
                {resolvedFilterOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.filter} value={option.filter}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuItem
                disabled={!isFilterActive}
                onClick={() => context.setColumnFilter?.(resolvedFilterKey, null)}>
                {t('datatable.filter.clear')}
              </DropdownMenuItem>
            </>
          )}
          {canFilterString && resolvedFilterKey && resolvedFilterField && (
            <>
              <DropdownMenuLabel>{t('datatable.filter.title')}</DropdownMenuLabel>
              <DataTableColumnStringFilter
                filterField={resolvedFilterField}
                filterKey={resolvedFilterKey}
                activeFilter={activeFilter}
                onApply={context.setColumnFilter!}
              />
            </>
          )}
          {canFilterSelect && resolvedFilterKey && resolvedFilterOptions && (
            <>
              <DropdownMenuLabel>{t('datatable.filter.title')}</DropdownMenuLabel>
              <DataTableColumnSelectFilter
                filterKey={resolvedFilterKey}
                activeFilter={activeFilter}
                options={resolvedFilterOptions}
                onApply={context.setColumnFilter!}
                onClose={() => setIsOpen(false)}
              />
            </>
          )}
          {canFilterDateRange && resolvedFilterKey && resolvedFilterField && (
            <>
              <DropdownMenuLabel>{t('datatable.filter.title')}</DropdownMenuLabel>
              <DataTableColumnDateRangeFilter
                filterField={resolvedFilterField}
                filterKey={resolvedFilterKey}
                activeFilter={activeFilter}
                onApply={context.setColumnFilter!}
                onClose={() => setIsOpen(false)}
              />
            </>
          )}
          {(canSort || canFilter) && <DropdownMenuSeparator />}
          <DropdownMenuItem className="font-bold" onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t('commands.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
