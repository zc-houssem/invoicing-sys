import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';

import { LogHtmlContent } from '@/components/administrative-tools/logger/LogHtmlContent';
import { ResponseLogDto } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const useLoggerColumns = (
  context: DataTableConfig<ResponseLogDto>
): ColumnDef<ResponseLogDto>[] => {
  const { t } = useTranslation('logs');
  return [
    {
      accessorKey: `${t('logger.columns.event')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('logger.columns.event')}
          attribute="event"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <span>{row.original.title ?? row.original.event}</span>;
      },
      enableSorting: true,
      enableHiding: true
    },

    {
      accessorKey: `${t('logger.columns.description')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('logger.columns.description')}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return (
          <LogHtmlContent
            html={row.original.description ?? ''}
            className="[&_a]:hover:underline [&_a]:text-primary [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
          />
        );
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('logger.columns.loggedAt')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('logger.columns.loggedAt')}
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    }
  ];
};
