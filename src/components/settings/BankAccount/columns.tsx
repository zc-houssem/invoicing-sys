import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { BANK_ACCOUNT_FILTER_ATTRIBUTES } from '@/constants/bank-account.filter-attributes';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseBankAccountDto } from '@/types';

export const useBankAccountColumns = (
  context: DataTableConfig<ResponseBankAccountDto>
): ColumnDef<ResponseBankAccountDto>[] => {
  const { t } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bank_account.attributes.name')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.NAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'bic',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bank_account.attributes.bic')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.BIC}
        />
      ),
      cell: ({ row }) => <div>{row.original.bic}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'rib',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bank_account.attributes.rib')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.RIB}
        />
      ),
      cell: ({ row }) => <div>{row.original.rib}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'iban',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bank_account.attributes.iban')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.IBAN}
        />
      ),
      cell: ({ row }) => <div>{row.original.iban}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'currency',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('bank_account.attributes.currency')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.CURRENCY}
        />
      ),
      cell: ({ row }) =>
        row.original.currency ? (
          <div>
            {tCurrency(row.original?.currency?.code)} ({row.original.currency?.symbol})
          </div>
        ) : (
          <div className="flex items-center gap-2 font-bold">
            <X className="h-5 w-5" /> <span>No Currency</span>
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
          title={t('bank_account.attributes.isMain')}
          attribute={BANK_ACCOUNT_FILTER_ATTRIBUTES.ISMAIN}
        />
      ),
      cell: ({ row }) => (
        <div>
          {
            <Badge variant={row.original.isMain ? 'default' : 'outline'} className="px-5">
              {row.original.isMain ? 'Primary' : 'Secondary'}
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
