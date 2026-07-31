import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ResponsePaymentDto } from '@/types';

export const usePaymentColumns = (
  context: DataTableConfig<ResponsePaymentDto>
): ColumnDef<ResponsePaymentDto>[] => {
  const { t } = useTranslation('invoicing');

  return [
    {
      accessorKey: t('payment.table.columns.id', 'ID'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.id', 'ID')}
          attribute={'id'}
        />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('payment.table.columns.status', 'Status'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.status', 'Status')}
          attribute={'status'}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge variant={'outline'}>{row.original.status || 'Draft'}</Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('payment.table.columns.date', 'Date'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.date', 'Date')}
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
    // {
    //   accessorKey: t('payment.table.columns.amount', 'Amount'),
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('payment.table.columns.amount', 'Amount')}
    //       attribute={'amount'}
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     const currency = row.original.currency?.payload;
    //     if (!currency) return <div>{row.original.amount}</div>;
    //     const amount = dinero({
    //       amount: createDineroAmountFromUnitWithDynamicCurrency(
    //         row.original.amount || 0,
    //         currency.digitAfterComma || 3
    //       ),
    //       precision: currency.digitAfterComma || 3
    //     }).toFormat('$0,0.00');
    //     return <div>{amount.replace('$', currency.symbol || '')}</div>;
    //   },
    //   enableSorting: true,
    //   enableHiding: true
    // },
    {
      accessorKey: t('payment.table.columns.mode', 'Mode'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.mode', 'Mode')}
          attribute={'mode'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.mode ? t(`payment.modes.${row.original.mode}`, row.original.mode) : ''}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('payment.table.columns.enterprise', 'Enterprise'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.enterprise', 'Enterprise')}
          attribute={'enterprise.name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.enterprise?.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('payment.table.columns.createdAt', 'Created At'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.table.columns.createdAt', 'Created At')}
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
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};
