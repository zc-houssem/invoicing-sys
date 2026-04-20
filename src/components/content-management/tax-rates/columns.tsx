import { ResponseTaxRateDto, Tax } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';

export const useTaxRateColumns = (
  context: DataTableConfig<ResponseTaxRateDto>
): ColumnDef<ResponseTaxRateDto>[] => {
  const { t } = useTranslation('content-management');
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: t('taxRate.table.columns.label'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('taxRate.table.columns.label')}
          attribute={'label'}
        />
      ),
      cell: ({ row }) => <Label>{row.original.label}</Label>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('taxRate.table.columns.type'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('taxRate.table.columns.type')}
          attribute={'type'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.type == 'rate'
            ? t('taxRate.table.columns.rate')
            : t('taxRate.table.columns.fixed')}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('taxRate.table.columns.value'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('taxRate.table.columns.value')}
          attribute={'value'}
        />
      ),
      cell: ({ row }) => (
        <Label className="flex gap-1">
          <span>{row.original.value?.toFixed(2)}</span>
          <span>
            {row.original.type == 'rate' ? '%' : row.original.currency?.extras.symbol || ''}
          </span>
        </Label>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('taxRate.table.columns.special'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('taxRate.table.columns.special')}
          attribute={'special'}
        />
      ),
      cell: ({ row }) => (
        <Badge>{row.original.special ? tCommon('answer.yes') : tCommon('answer.no')}</Badge>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('taxRate.table.columns.currency'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('taxRate.table.columns.currency')}
          attribute={'currency.label'}
        />
      ),
      cell: ({ row }) =>
        row.original.currency ? (
          <div className="font-bold">{tCurrency(row.original.currency?.extras?.code)}</div>
        ) : (
          <div className="flex items-center gap-2 font-thin">
            {t('taxRate.table.columns.applicable_on_all')}
          </div>
        ),
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
