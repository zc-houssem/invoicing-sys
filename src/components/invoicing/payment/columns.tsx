import React from 'react';
import Link from 'next/link';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import {
  DataTableCellVariant,
  DataTableColumnFilterOption,
  DataTableConfig
} from '@/components/shared/data-table/types';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { ResponsePaymentDto } from '@/types';
import { CreatedByDisplay } from '../CreatedByDisplay';

const PAYMENT_STATUSES = ['Draft', 'Validated', 'Cancelled'] as const;
const PAYMENT_MODES = ['Cash', 'Transfer', 'Check', 'CreditCard', 'Other'] as const;

export const usePaymentColumns = (
  context: DataTableConfig<ResponsePaymentDto>,
  options?: { hideEnterprise?: boolean; hideInterlocutor?: boolean; hideCreatedBy?: boolean },
  currencyFilterOptions?: DataTableColumnFilterOption[]
): ColumnDef<ResponsePaymentDto>[] => {
  const { t } = useTranslation('invoicing');

  return React.useMemo(() => {
    const statusFilterOptions = PAYMENT_STATUSES.map((status) => ({
      label: t(`payment.status.${status}`, status),
      filter: `status||$eq||${status}`
    }));

    const modeFilterOptions = PAYMENT_MODES.map((mode) => ({
      label: t(`payment.modes.${mode}`, mode),
      filter: `mode||$eq||${mode}`
    }));

    const columns: ColumnDef<ResponsePaymentDto>[] = [
      {
        accessorKey: t('payment.table.columns.sequence', 'Sequence'),
        meta: {
          filterKey: 'sequence',
          filterField: 'sequence',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.sequence', 'Sequence')}
            attribute={'sequence'}
          />
        ),
        cell: ({ row }) => <div>{row.original.sequence || row.original.id}</div>,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.status', 'Status'),
        meta: {
          filterKey: 'status',
          filterType: 'options',
          filterOptions: statusFilterOptions
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.status', 'Status')}
            attribute={'status'}
          />
        ),
        cell: ({ row }) => {
          const s = row.original.status || 'Draft';
          return (
            <div>
              <Badge variant={'outline'}>{t(`payment.status.${s}`, s)}</Badge>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.createdBy', 'Created by'),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.createdBy', 'Created by')}
            attribute={'createdBy.firstName'}
          />
        ),
        cell: ({ row }) => <CreatedByDisplay user={row.original.createdBy} />,
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.date', 'Date'),
        meta: {
          filterKey: 'date',
          filterField: 'date',
          filterType: 'date-range'
        },
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
          return <DataTableCell variant={DataTableCellVariant.DATE} value={date} />;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.currency', 'Currency'),
        meta: {
          filterKey: 'currency',
          filterType: 'select',
          filterMultiSelect: true,
          filterOptions: currencyFilterOptions
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.currency', 'Currency')}
            attribute={'currency.label'}
          />
        ),
        cell: ({ row }) => {
          const symbol = row.original.currency?.extras?.symbol;
          const label = row.original.currency?.label;
          return <div>{symbol ? `${label || ''} (${symbol})` : label || '—'}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.amount', 'Amount'),
        meta: {
          filterKey: 'amount',
          filterField: 'amount',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.amount', 'Amount')}
            attribute={'amount'}
          />
        ),
        cell: ({ row }) => {
          const symbol = row.original.currency?.extras?.symbol || '';
          const digits = Number(row.original.currency?.extras?.digitsAfterComma ?? 3);
          const amount = Number(row.original.amount ?? 0);
          return <div className="font-semibold">{`${amount.toFixed(digits)} ${symbol}`}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.fee', 'Fee'),
        meta: {
          filterKey: 'fee',
          filterField: 'fee',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.fee', 'Fee')}
            attribute={'fee'}
          />
        ),
        cell: ({ row }) => {
          const symbol = row.original.currency?.extras?.symbol || '';
          const digits = Number(row.original.currency?.extras?.digitsAfterComma ?? 3);
          const fee = Number(row.original.fee ?? 0);
          return <div>{`${fee.toFixed(digits)} ${symbol}`}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.mode', 'Mode'),
        meta: {
          filterKey: 'mode',
          filterType: 'options',
          filterOptions: modeFilterOptions
        },
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
        meta: {
          filterKey: 'enterprise',
          filterField: 'enterprise.name',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.enterprise', 'Enterprise')}
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
              onClick={(e) => e.stopPropagation()}
            >
              {ent.name}
            </Link>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: t('payment.table.columns.createdAt', 'Created At'),
        meta: {
          filterKey: 'createdAt',
          filterField: 'createdAt',
          filterType: 'date-range'
        },
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
        accessorKey: t('payment.table.columns.updatedAt', 'Updated At'),
        meta: {
          filterKey: 'updatedAt',
          filterField: 'updatedAt',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            context={context}
            title={t('payment.table.columns.updatedAt', 'Updated At')}
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
      if (options?.hideEnterprise && (col as any).accessorKey === t('payment.table.columns.enterprise', 'Enterprise')) return false;
      if (options?.hideInterlocutor && (col as any).accessorKey === t('payment.table.columns.interlocutor', 'Interlocutor')) return false;
      if (options?.hideCreatedBy && (col as any).accessorKey === t('payment.table.columns.createdBy', 'Created by')) return false;
      return true;
    });
  }, [context, currencyFilterOptions, options?.hideCreatedBy, options?.hideEnterprise, options?.hideInterlocutor, t]);
};
