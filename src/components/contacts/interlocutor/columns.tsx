import { ResponseInterlocutorDto } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';

export const useInterlocutorColumns = (
  context: DataTableConfig<ResponseInterlocutorDto>
): ColumnDef<ResponseInterlocutorDto>[] => {
  const { t } = useTranslation('contacts');
  const { t: tCommon } = useTranslation('common');

  const columns: ColumnDef<ResponseInterlocutorDto>[] = [
    {
      accessorKey: t('interlocutor.table.columns.socialTitle'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.socialTitle')}
          attribute={'title'}
        />
      ),
      cell: ({ row }) => <div>{row.original.title}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.firstName'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.firstName')}
          attribute={'firstName'}
        />
      ),
      cell: ({ row }) => <div>{row.original.firstName}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.lastName'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.lastName')}
          attribute={'lastName'}
        />
      ),
      cell: ({ row }) => <div>{row.original.lastName}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.phone'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.phone')}
          attribute={'phone'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.phone ? (
            row.original?.phone
          ) : (
            <span className="opacity-50">{t('interlocutor.emptyCells.phone')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.email'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.email')}
          attribute={'email'}
        />
      ),
      cell: ({ row }) => (
        <a
          className="font-bold cursor-pointer hover:underline"
          href={`mailto:${row.original.email}`}>
          {row.original.email}
        </a>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.createdAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.createdAt')}
          attribute={'createdAt'}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: t('interlocutor.table.columns.updatedAt'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('interlocutor.table.columns.updatedAt')}
          attribute={'updatedAt'}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.updatedAt);
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

  return columns;
};
