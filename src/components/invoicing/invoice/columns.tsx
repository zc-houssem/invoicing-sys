import Link from 'next/link';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { Badge } from '@/components/ui/badge';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { CreatedByDisplay } from '../CreatedByDisplay';

export const useSellingInvoiceColumns = (
  context: DataTableConfig<ResponseInvoiceDto>,
  options?: { hideEnterprise?: boolean; hideInterlocutor?: boolean; hideCreatedBy?: boolean }
): ColumnDef<ResponseInvoiceDto>[] => {
  const { t } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  const columns: ColumnDef<ResponseInvoiceDto>[] = [
    {
      accessorKey: t('invoice.table.columns.sequence', 'Sequence'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.sequence', 'Sequence')}
          attribute={'sequence'}
        />
      ),

      cell: ({ row }) => <div>{row.original.sequence || row.original.id}</div>,
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
      cell: ({ row }) => {
        const s = row.original.status || '';
        return (
          <div>
            <Badge variant={'outline'}>{t(`invoice.status.${s}`, s)}</Badge>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('invoice.table.columns.createdBy', 'Created by'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.createdBy', 'Created by')}
          attribute={'createdBy.firstName'}
        />
      ),
      cell: ({ row }) => <CreatedByDisplay user={row.original.createdBy} />,
      enableSorting: false,
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
        return <DataTableCell variant={DataTableCellVariant.DATE} value={date} />;
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
        return <DataTableCell variant={DataTableCellVariant.DATE} value={date} />;
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
      accessorKey: 'source',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.source', 'Source')}
          attribute={'quotationId'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.quotationId ? (
            <a
              href={`/selling/quotations/${row.original.quotationId}`}
              className="text-primary hover:underline">
              {row.original.quotation?.sequence || row.original.quotationId}
            </a>
          ) : (
            <span className="text-muted-foreground">
              {t('invoice.table.source.direct', 'Direct')}
            </span>
          )}
        </div>
      ),
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
      cell: ({ row }) => {
        const ent = row.original.enterprise;
        const entId = row.original.enterpriseId || ent?.id;
        if (!ent?.name || !entId) return <div>—</div>;
        return (
          <Link
            href={`/contacts/enterprise/${entId}`}
            className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            onClick={(e) => e.stopPropagation()}>
            {ent.name}
          </Link>
        );
      },
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
      id: 'totalIncludingTaxes',
      accessorKey: 'totalIncludingTaxes',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.total', 'Total TTC')}
          attribute={'totalIncludingTaxes'}
        />
      ),
      cell: ({ row }) => {
        const inv = row.original;
        const symbol = inv.currency?.extras?.symbol || '';
        const digits = Number(inv.currency?.extras?.digitsAfterComma ?? 3);
        return <div>{`${Number(inv.totalIncludingTaxes || 0).toFixed(digits)} ${symbol}`}</div>;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'taxWithholding',
      accessorKey: 'taxWithholding',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.taxWithholding', 'Retenue à la source')}
          attribute={'taxWithholdingAmount'}
        />
      ),
      cell: ({ row }) => {
        const inv = row.original;
        const rate = inv.taxWithholding?.extras?.rate || 0;
        const amount = Number(inv.taxWithholdingAmount || 0);
        const symbol = inv.currency?.extras?.symbol || '';
        const digits = Number(inv.currency?.extras?.digitsAfterComma ?? 3);

        return <div>{rate > 0 ? `${amount.toFixed(digits)} ${symbol} (${rate}%)` : '-'}</div>;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'amountToPay',
      accessorKey: 'amountToPay',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.table.columns.amountToPay', 'Montant à payer')}
          attribute={'amountToPay'}
        />
      ),
      cell: ({ row }) => {
        const inv = row.original;
        const amount = Number(inv.amountToPay || 0);
        const symbol = inv.currency?.extras?.symbol || '';
        const digits = Number(inv.currency?.extras?.digitsAfterComma ?? 3);

        return <div>{`${amount.toFixed(digits)} ${symbol}`}</div>;
      },
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

  return columns.filter((col) => {
    if (options?.hideEnterprise && (col as any).accessorKey === t('invoice.table.columns.enterprise')) return false;
    if (options?.hideInterlocutor && (col as any).accessorKey === t('invoice.table.columns.interlocutor')) return false;
    if (options?.hideCreatedBy && (col as any).accessorKey === t('invoice.table.columns.createdBy')) return false;
    return true;
  });
};
