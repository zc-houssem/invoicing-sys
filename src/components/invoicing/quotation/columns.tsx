import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableConfig } from '@/components/shared/data-table/types';
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
    }
  ];
};
