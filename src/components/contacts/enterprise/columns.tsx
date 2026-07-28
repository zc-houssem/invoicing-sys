import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { ResponseEnterpriseDto } from '@/types/core/enterprise';

export const useEnterpriseColumns = (
  context: DataTableConfig<ResponseEnterpriseDto>
): ColumnDef<ResponseEnterpriseDto>[] => {
  const { t } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: t('enterprise.table.columns.name'),
      meta: {
        exportLabel: t('enterprise.table.columns.name'),
        exportKey: 'name'
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
        exportKey: 'phone'
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
      accessorKey: t('enterprise.table.columns.website'),
      meta: {
        exportLabel: t('enterprise.table.columns.website'),
        exportKey: 'website'
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
        exportKey: 'taxId'
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
            : t('enterprise.table.columns.particular.negative')
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
        exportValue: (row) => row.activity?.label.toLocaleString()
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
    // {
    //   accessorKey: 'currency',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('enterprise.attributes.currency')}
    //       attribute={FIRM_FILTER_ATTRIBUTES.CURRENCY}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original?.currency ? (
    //         <span>
    //           {row.original?.currency?.code && tCurrency(row.original?.currency?.code)} (
    //           {row.original?.currency?.symbol})
    //         </span>
    //       ) : (
    //         <span className="text-zinc-400">{t('enterprise.empty_cells.currency')}</span>
    //       )}
    //     </div>
    //   ),
    //   enableSorting: true,
    //   enableHiding: true
    // },
    {
      accessorKey: t('enterprise.table.columns.createdAt'),
      meta: {
        exportLabel: t('enterprise.table.columns.createdAt'),
        exportValue: (row) => new Date(row.createdAt).toLocaleString()
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
        exportValue: (row) => new Date(row.updatedAt).toLocaleString()
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};
