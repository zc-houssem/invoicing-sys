import { ColumnDef } from '@tanstack/react-table';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseTemplateFooterDto } from '@/types';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';

export const useTemplateFooterColumns = (
  context: DataTableConfig<ResponseTemplateFooterDto>
): ColumnDef<ResponseTemplateFooterDto>[] => {
  const { t } = useTranslation('content-management');

  return [
    {
      accessorKey: t('templateFooter.table.columns.name', { defaultValue: 'Name' }),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('templateFooter.table.columns.name', { defaultValue: 'Name' })}
          attribute={'name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('templateFooter.table.columns.description', { defaultValue: 'Description' }),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('templateFooter.table.columns.description', { defaultValue: 'Description' })}
          attribute={'description'}
        />
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.original.description || (
            <span className="opacity-50">{t('templateFooter.table.emptyCells.description', { defaultValue: '-' })}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('templateFooter.table.columns.createdAt', { defaultValue: 'Created At' }),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('templateFooter.table.columns.createdAt', { defaultValue: 'Created At' })}
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
      accessorKey: t('templateFooter.table.columns.updatedAt', { defaultValue: 'Updated At' }),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('templateFooter.table.columns.updatedAt', { defaultValue: 'Updated At' })}
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
  ];
};
