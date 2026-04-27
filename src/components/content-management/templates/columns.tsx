import { ColumnDef } from '@tanstack/react-table';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseTemplateDto } from '@/types';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';

export const useTemplateColumns = (
  context: DataTableConfig<ResponseTemplateDto>
): ColumnDef<ResponseTemplateDto>[] => {
  const { t } = useTranslation('content-management');

  return [
    {
      accessorKey: t('template.table.columns.name'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('template.table.columns.name')}
          attribute={'name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('template.table.columns.description'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('template.table.columns.description')}
          attribute={'description'}
        />
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.original.description || (
            <span className="opacity-50">{t('template.table.emptyCells.description')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('template.table.columns.type'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('template.table.columns.type')}
          attribute={'templateType'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.templateType || (
            <span className="opacity-50">{t('template.table.emptyCells.type')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('template.table.columns.createdAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('template.table.columns.createdAt')}
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
      accessorKey: t('template.table.columns.updatedAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('template.table.columns.updatedAt')}
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
