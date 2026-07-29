import React from 'react';
import { ResponseInterlocutorDto } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableCellVariant, DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { SOCIAL_TITLE } from '@/api';

export const useInterlocutorColumns = (
  context: DataTableConfig<ResponseInterlocutorDto>,
  enterpriseId?: number
): ColumnDef<ResponseInterlocutorDto>[] => {
  const { t } = useTranslation('contacts');
  const { t: tCommon } = useTranslation('common');
  const { t: tSocial } = useTranslation('social-title');

  return React.useMemo(() => {
    const columns: ColumnDef<ResponseInterlocutorDto>[] = [
      {
        accessorKey: t('interlocutor.table.columns.socialTitle'),
        meta: {
          exportLabel: t('interlocutor.table.columns.socialTitle'),
          exportValue: (row) => row.title ? tSocial(row.title) : '',
          exportKey: 'title',
          filterKey: 'title',
          filterType: 'select',
          filterOptions: Object.values(SOCIAL_TITLE).map((title) => ({
            label: tSocial(title),
            filter: `title||$eq||${title}`
          }))
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={t('interlocutor.table.columns.socialTitle')}
            attribute={'title'}
          />
        ),
        cell: ({ row }) => <div>{row.original.title ? tSocial(row.original.title) : ''}</div>,
        enableSorting: true,
        enableHiding: true,
        enableColumnFilter: true
      },
      {
        accessorKey: t('interlocutor.table.columns.firstName'),
        meta: {
          exportLabel: t('interlocutor.table.columns.firstName'),
          exportKey: 'firstName',
          filterKey: 'firstName',
          filterField: 'firstName',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={t('interlocutor.table.columns.firstName')}
            attribute={'firstName'}
          />
        ),
        cell: ({ row }) => <div>{row.original.firstName}</div>,
        enableSorting: true,
        enableHiding: true,
        enableColumnFilter: true
      },
      {
        accessorKey: t('interlocutor.table.columns.lastName'),
        meta: {
          exportLabel: t('interlocutor.table.columns.lastName'),
          exportKey: 'lastName',
          filterKey: 'lastName',
          filterField: 'lastName',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={t('interlocutor.table.columns.lastName')}
            attribute={'lastName'}
          />
        ),
        cell: ({ row }) => <div>{row.original.lastName}</div>,
        enableSorting: true,
        enableHiding: true,
        enableColumnFilter: true
      },
      {
        accessorKey: t('interlocutor.table.columns.phone'),
        meta: {
          exportLabel: t('interlocutor.table.columns.phone'),
          exportKey: 'phone',
          filterKey: 'phone',
          filterField: 'phone',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
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
        enableHiding: true,
        enableColumnFilter: true
      },
      {
        accessorKey: t('interlocutor.table.columns.email'),
        meta: {
          exportLabel: t('interlocutor.table.columns.email'),
          exportKey: 'email',
          filterKey: 'email',
          filterField: 'email',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
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
        enableHiding: true,
        enableColumnFilter: true
      }
    ];

    if (enterpriseId) {
      columns.push({
        accessorKey: t('interlocutor.table.columns.position', 'Position'),
        meta: {
          exportLabel: t('interlocutor.table.columns.position', 'Position'),
          exportKey: 'position',
          filterKey: 'enterpriseInterlocutors.position',
          filterField: 'enterpriseInterlocutors.position',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={t('interlocutor.table.columns.position', 'Position')}
            attribute={'position'}
          />
        ),
        cell: ({ row }) => {
          // Find the enterprise entry
          const entry =
            (row.original as any).firmsToInterlocutor?.find((e: any) => e.firmId === enterpriseId) ||
            (row.original as any).enterprises?.find((e: any) => e.enterpriseId === enterpriseId) ||
            (row.original as any).enterpriseInterlocutors?.find(
              (e: any) => e.enterpriseId === enterpriseId
            );
          return <div>{entry?.position || '-'}</div>;
        },
        enableSorting: false,
        enableHiding: true,
        enableColumnFilter: true
      });
    }

    columns.push(
      {
        accessorKey: t('interlocutor.table.columns.createdAt'),
        meta: {
          exportLabel: t('interlocutor.table.columns.createdAt'),
          exportValue: (row) => new Date(row.createdAt).toLocaleString(),
          filterKey: 'createdAt',
          filterField: 'createdAt',
          filterType: 'date-range'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
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
        meta: {
          exportLabel: t('interlocutor.table.columns.updatedAt'),
          exportValue: (row) => new Date(row.updatedAt).toLocaleString(),
          filterKey: 'updatedAt',
          filterField: 'updatedAt',
          filterType: 'date-range'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
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
        meta: { skipExport: true },
        cell: ({ row, table }) => (
          <div className="flex justify-end">
            <DataTableRowActions row={row} context={(table.options.meta as any)?.context} />
          </div>
        )
      }
    );

    return columns;
  }, [t, tCommon, tSocial, enterpriseId]);
};
