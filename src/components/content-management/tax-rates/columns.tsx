import React from 'react';
import { ResponseTaxRateDto } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableCellVariant, DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { useTranslation } from 'react-i18next';

export const useTaxRateColumns = (
  context: DataTableConfig<ResponseTaxRateDto>,
  currencyFilterOptions: DataTableColumnFilterOption[] = []
): ColumnDef<ResponseTaxRateDto>[] => {
  const { t } = useTranslation('content-management');
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');

  return React.useMemo(
    () => [
      {
        accessorKey: t('taxRate.table.columns.label'),
        meta: {
          filterKey: 'label',
          filterField: 'label',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.label')}
            attribute={'label'}
          />
        ),
        cell: ({ row }) => <div>{row.original.label}</div>,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.type'),
        meta: {
          filterKey: 'type',
          filterType: 'options',
          filterOptions: [
            {
              label: t('taxRate.table.columns.rate'),
              filter: 'type||$eq||rate'
            },
            {
              label: t('taxRate.table.columns.fixed'),
              filter: 'type||$eq||fixed'
            }
          ]
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.type')}
            attribute={'type'}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.type == 'rate'
              ? t('taxRate.table.columns.rate')
              : t('taxRate.table.columns.fixed')}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.value'),
        meta: {
          filterKey: 'value',
          filterField: 'value',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.value')}
            attribute={'value'}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.value?.toFixed(2)}
            {row.original.type == 'rate' ? '%' : ` ${row.original.currency?.extras.symbol || ''}`}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.special'),
        meta: {
          filterKey: 'special',
          filterType: 'options',
          filterOptions: [
            {
              label: tCommon('answer.yes'),
              filter: 'special||$eq||1'
            },
            {
              label: tCommon('answer.no'),
              filter: 'special||$eq||0'
            }
          ]
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.special')}
            attribute={'special'}
          />
        ),
        cell: ({ row }) => (
          <div>{row.original.special ? tCommon('answer.yes') : tCommon('answer.no')}</div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.currency'),
        meta: {
          filterKey: 'currency',
          filterType: 'select',
          filterMultiSelect: true,
          filterOptions: currencyFilterOptions
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.currency')}
            attribute={'currency.label'}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.currencyId ? (
              `${tCurrency(row.original.currency?.extras?.code)} (${row.original.currency?.extras?.symbol})`
            ) : (
              <span className="opacity-50">{t('taxRate.table.emptyCells.currency')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.createdAt'),
        meta: {
          filterKey: 'createdAt',
          filterField: 'createdAt',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.createdAt')}
            attribute={'createdAt'}
          />
        ),
        cell: ({ row }) => {
          const date = new Date(row?.original?.createdAt);
          return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('taxRate.table.columns.updatedAt'),
        meta: {
          filterKey: 'updatedAt',
          filterField: 'updatedAt',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('taxRate.table.columns.updatedAt')}
            attribute={'updatedAt'}
          />
        ),
        cell: ({ row }) => {
          const date = new Date(row?.original?.updatedAt);
          return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DataTableRowActions row={row} context={context} />
          </div>
        )
      }
    ],
    [context, currencyFilterOptions, t, tCommon, tCurrency]
  );
};
