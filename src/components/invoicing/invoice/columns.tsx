import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { Badge } from '@/components/ui/badge';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const useSellingInvoiceColumns = (
  context: DataTableConfig<ResponseInvoiceDto>
): ColumnDef<ResponseInvoiceDto>[] => {
  const { t } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: t('invoice.table.columns.id'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.id')}
          attribute={'id'}
        />
      ),

      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.status'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.status')}
          attribute={'status'}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge variant={'outline'}>{row.original.status}</Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.date'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.date')}
          attribute={'date'}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.date ? new Date(row.original.date) : null;
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.dueDate'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.dueDate')}
          attribute={'dueDate'}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.dueDate ? new Date(row.original.dueDate) : null;
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.object'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.object')}
          attribute={'object'}
        />
      ),
      cell: ({ row }) => <div>{row.original.object}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.enterprise'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.enterprise')}
          attribute={'enterprise.name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.enterprise?.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.interlocutor'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.interlocutor')}
          attribute={'interlocutor.firstName'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.interlocutor
            ? `${row.original.interlocutor.firstName} ${row.original.interlocutor.lastName}`
            : ''}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.createdAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.createdAt')}
          attribute={'createdAt'}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.updatedAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.updatedAt')}
          attribute={'updatedAt'}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.updatedAt ? new Date(row.original.updatedAt) : null;
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
