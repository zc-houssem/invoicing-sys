import React from 'react';
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

const INVOICE_STATUSES = [
  'Draft',
  'Validated',
  'Sent',
  'PartiallyPaid',
  'Paid',
  'Overdue'
] as const;

export const useSellingInvoiceColumns = (
  context: DataTableConfig<ResponseInvoiceDto>,
  options?: { hideEnterprise?: boolean; hideInterlocutor?: boolean; hideCreatedBy?: boolean }
): ColumnDef<ResponseInvoiceDto>[] => {
  const { t } = useTranslation('invoicing');

  return React.useMemo(() => {
    const statusFilterOptions = INVOICE_STATUSES.map((status) => ({
      label: t(`invoice.status.${status}`, status),
      filter: `status||$eq||${status}`
    }));

    const columns: ColumnDef<ResponseInvoiceDto>[] = [
      {
        accessorKey: t('invoice.table.columns.sequence', 'Sequence'),
        meta: {
          filterKey: 'sequence',
          filterField: 'sequence',
          filterType: 'string'
        },
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
        meta: {
          filterKey: 'status',
          filterType: 'options',
          filterOptions: statusFilterOptions
        },
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
        meta: {
          filterKey: 'date',
          filterField: 'date',
          filterType: 'date-range'
        },
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
        meta: {
          filterKey: 'dueDate',
          filterField: 'dueDate',
          filterType: 'date-range'
        },
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
        meta: {
          filterKey: 'object',
          filterField: 'object',
          filterType: 'string'
        },
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
        accessorKey: t('invoice.table.columns.source', 'Source'),
        meta: {
          filterKey: 'quotationId',
          filterField: 'quotationId',
          filterType: 'string'
        },
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
        meta: {
          filterKey: 'enterprise',
          filterField: 'enterprise.name',
          filterType: 'string'
        },
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
        meta: {
          filterKey: 'interlocutor',
          filterField: 'interlocutor.firstName',
          filterType: 'string'
        },
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
        accessorKey: t('invoice.table.columns.total', 'Total TTC'),
        meta: {
          filterKey: 'totalIncludingTaxes',
          filterField: 'totalIncludingTaxes',
          filterType: 'string'
        },
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
        accessorKey: t('invoice.table.columns.taxWithholding', 'Retenue à la source'),
        meta: {
          filterKey: 'taxWithholdingAmount',
          filterField: 'taxWithholdingAmount',
          filterType: 'string'
        },
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
        accessorKey: t('invoice.table.columns.amountToPay', 'Montant à payer'),
        meta: {
          filterKey: 'amountToPay',
          filterField: 'amountToPay',
          filterType: 'string'
        },
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
        meta: {
          filterKey: 'createdAt',
          filterField: 'createdAt',
          filterType: 'date-range'
        },
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
        meta: {
          filterKey: 'updatedAt',
          filterField: 'updatedAt',
          filterType: 'date-range'
        },
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
  }, [context, options?.hideCreatedBy, options?.hideEnterprise, options?.hideInterlocutor, t]);
};
