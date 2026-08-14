import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseRefTypeDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { JsonToggler } from '@/components/shared/JsonToggler';
import { Badge } from '@/components/ui/badge';

export const useRefTypeColumns = (
  context: DataTableConfig<ResponseRefTypeDto>
): ColumnDef<ResponseRefTypeDto>[] => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('content-management');
  return [
    {
      accessorKey: `${t('refType.columns.id')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.id')}
          attribute="id"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('refType.columns.label')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.label')}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('refType.columns.description')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.description')}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.description || t('refType.columns.noDescription')}</div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('refType.columns.parent')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.parent')}
          attribute="parent"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.parent?.label || (
            <span className="opacity-70">{t('refType.columns.noParent')}</span>
          )}
          {row.original.parentId && <span>({row.original.parentId})</span>}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('refType.columns.createdAt')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.createdAt')}
          attribute="createdAt"
          context={context}
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
      accessorKey: `${t('refType.columns.updatedAt')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.updatedAt')}
          attribute="updatedAt"
          context={context}
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
      accessorKey: `${t('refType.columns.extras')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('refType.columns.extras')}
          attribute="extras"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const extras = row?.original?.extras;
        return extras && Object.keys(extras).length > 0 ? (
          <JsonToggler data={extras} className="w-full" />
        ) : (
          <Badge variant="outline" className="text-xs">
            {tCommon('common.table.noData')}
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: true,
      size: 200
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};
