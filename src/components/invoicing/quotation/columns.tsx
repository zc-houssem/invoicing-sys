import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { ResponseQuotationDto } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const useSellingQuotationColumns = (
  context: DataTableConfig<ResponseQuotationDto>
): ColumnDef<ResponseQuotationDto>[] => {
  const { t } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} context={context} title="ID" attribute={'id'} />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title="Status"
          attribute={'status'}
        />
      ),
      cell: ({ row }) => <div>{row.original.status}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} context={context} title="Date" attribute={'date'} />
      ),
      cell: ({ row }) => {
        const date = row.original.date ? new Date(row.original.date) : null;
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title="Due Date"
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
      accessorKey: 'object',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title="Object"
          attribute={'object'}
        />
      ),
      cell: ({ row }) => <div>{row.original.object}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title="Created At"
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
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title="Updated At"
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
