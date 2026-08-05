import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { ResponseEnterpriseDto } from '@/types/core/enterprise';
import { EnterpriseLogo } from './EnterpriseLogo';

export const useEnterpriseColumns = (
  context: DataTableConfig<ResponseEnterpriseDto>,
  activityFilterOptions?: DataTableColumnFilterOption[]
): ColumnDef<ResponseEnterpriseDto>[] => {
  const { t } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  return React.useMemo(() => [
    {
      accessorKey: 'logo',
      meta: { skipExport: true },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.logo')}
          attribute={'logoId'}
        />
      ),
      cell: ({ row }) => (
        <EnterpriseLogo
          logoId={row.original.logoId}
          name={row.original.name}
          className="size-8 rounded-md border"
          fallbackClassName="rounded-md text-xs font-medium"
        />
      ),
      enableSorting: false,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.name'),
      meta: {
        exportLabel: t('enterprise.table.columns.name'),
        exportKey: 'name',
        filterKey: 'name',
        filterField: 'name',
        filterType: 'string'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.name')}
          attribute={'name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.phone'),
      meta: {
        exportLabel: t('enterprise.table.columns.phone'),
        exportKey: 'phone',
        filterKey: 'phone',
        filterField: 'phone',
        filterType: 'string'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.phone')}
          attribute={'phone'}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.phone ? (
            row.original?.phone
          ) : (
            <span className="opacity-50">{t('enterprise.table.emptyCells.phone')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.email'),
      meta: {
        exportLabel: t('enterprise.table.columns.email'),
        exportKey: 'email',
        filterKey: 'email',
        filterField: 'email',
        filterType: 'string'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.email')}
          attribute={'email'}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.email ? (
            row.original.email
          ) : (
            <span className="opacity-50">{t('enterprise.table.emptyCells.email')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.website'),
      meta: {
        exportLabel: t('enterprise.table.columns.website'),
        exportKey: 'website',
        filterKey: 'website',
        filterField: 'website',
        filterType: 'string'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.website')}
          attribute={'website'}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {' '}
          {row.original?.website ? (
            <a
              className="flex items-center gap-1"
              href={row.original?.website}
              target="_blank"
              rel="noreferrer">
              {row.original?.website}
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          ) : (
            <span className="opacity-50">{t('enterprise.table.emptyCells.website')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.taxId'),
      meta: {
        exportLabel: t('enterprise.table.columns.taxId'),
        exportKey: 'taxId',
        filterKey: 'taxId',
        filterField: 'taxId',
        filterType: 'string'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.taxId')}
          attribute={'taxId'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.taxId || (
            <span className="opacity-50">{t('enterprise.table.emptyCells.taxId')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.particular.noun'),
      meta: {
        exportLabel: t('enterprise.table.columns.particular.noun'),
        exportValue: (row) =>
          row.particular
            ? t('enterprise.table.columns.particular.positive')
            : t('enterprise.table.columns.particular.negative'),
        filterKey: 'particular',
        filterType: 'options',
        filterOptions: [
          {
            label: t('enterprise.table.columns.particular.positive'),
            filter: 'particular||$eq||1'
          },
          {
            label: t('enterprise.table.columns.particular.negative'),
            filter: 'particular||$eq||0'
          }
        ]
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.particular.noun')}
          attribute={'particular'}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge variant={row.original?.particular ? 'default' : 'outline'}>
            {row.original?.particular
              ? t('enterprise.table.columns.particular.positive')
              : t('enterprise.table.columns.particular.negative')}
          </Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'activity',
      meta: {
        exportLabel: t('enterprise.table.columns.activity'),
        exportValue: (row) => row.activity?.label.toLocaleString(),
        filterKey: 'activity',
        filterType: 'select',
        filterOptions: activityFilterOptions
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.attributes.activity')}
          attribute={'activityId'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.activity?.label || (
            <span className="opacity-50">{t('enterprise.table.emptyCells.activity')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('enterprise.table.columns.createdAt'),
      meta: {
        exportLabel: t('enterprise.table.columns.createdAt'),
        exportValue: (row) => new Date(row.createdAt).toLocaleString(),
        filterKey: 'createdAt',
        filterField: 'createdAt',
        filterType: 'date-range'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.createdAt')}
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
      accessorKey: t('enterprise.table.columns.updatedAt'),
      meta: {
        exportLabel: t('enterprise.table.columns.updatedAt'),
        exportValue: (row) => new Date(row.updatedAt).toLocaleString(),
        filterKey: 'updatedAt',
        filterField: 'updatedAt',
        filterType: 'date-range'
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader
          column={column}
          context={(table.options.meta as any)?.context}
          title={t('enterprise.table.columns.updatedAt')}
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
      meta: { skipExport: true },
      cell: ({ row, table }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={(table.options.meta as any)?.context} />
        </div>
      )
    }
  ], [t, tCurrency, activityFilterOptions]);
};
