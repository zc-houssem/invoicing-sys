import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseBankAccountDto } from '@/types';

export const useBankAccountColumns = (
  context: DataTableConfig<ResponseBankAccountDto>
): ColumnDef<ResponseBankAccountDto>[] => {
  const { t } = useTranslation('content-management');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: t('bankAccount.table.columns.name'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.name')}
          attribute={'name'}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('bankAccount.table.columns.bic'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.bic')}
          attribute={'bic'}
        />
      ),
      cell: ({ row }) => <div>{row.original.bic}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('bankAccount.table.columns.rib'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.rib')}
          attribute={'rib'}
        />
      ),
      cell: ({ row }) => <div>{row.original.rib}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('bankAccount.table.columns.iban'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.iban')}
          attribute={'iban'}
        />
      ),
      cell: ({ row }) => <div>{row.original.iban}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('bankAccount.table.columns.currency'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.currency')}
          attribute={'currency'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.currency ? (
            `${tCurrency(row.original?.currency?.code)} (${row.original.currency?.symbol})`
          ) : (
            <span className="opacity-50">{t('bankAccount.table.emptyCells.currency')}</span>
          )}
        </div>
      ),

      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'isMain',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bankAccount.table.columns.isMain')}
          attribute={'isMain'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {
            <Badge variant={row.original.isMain ? 'default' : 'outline'} className="px-5">
              {row.original.isMain
                ? t('bankAccount.table.columns.isMainPrimary')
                : t('bankAccount.table.columns.isMainSecondary')}
            </Badge>
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: false
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
