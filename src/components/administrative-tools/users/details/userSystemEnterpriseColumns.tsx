import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import {
  DataTableCellVariant,
  DataTableColumnFilterOption,
  DataTableConfig
} from '@/components/shared/data-table/types';
import { ResponseEnterpriseMemberDto } from '@/types';
import { useTranslation } from 'react-i18next';

export const useUserSystemEnterpriseColumns = (
  context: DataTableConfig<ResponseEnterpriseMemberDto>,
  activityFilterOptions?: DataTableColumnFilterOption[]
): ColumnDef<ResponseEnterpriseMemberDto>[] => {
  const { t: tContacts } = useTranslation('contacts');
  const { t: tUser } = useTranslation('user-management');

  return React.useMemo(
    () => [
      {
        accessorKey: 'enterprise.name',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.name'),
          exportValue: (row: ResponseEnterpriseMemberDto) => row.enterprise?.name,
          filterKey: 'name',
          filterField: 'enterprise.name',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.name')}
            attribute="enterprise.name"
          />
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.enterprise?.name}</div>,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.phone',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.phone'),
          exportValue: (row: ResponseEnterpriseMemberDto) => row.enterprise?.phone,
          filterKey: 'phone',
          filterField: 'enterprise.phone',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.phone')}
            attribute="enterprise.phone"
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.enterprise?.phone || (
              <span className="opacity-50">{tContacts('enterprise.table.emptyCells.phone')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.website',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.website'),
          exportValue: (row: ResponseEnterpriseMemberDto) => row.enterprise?.website,
          filterKey: 'website',
          filterField: 'enterprise.website',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.website')}
            attribute="enterprise.website"
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.enterprise?.website ? (
              <a
                className="flex items-center gap-1"
                href={row.original.enterprise.website}
                target="_blank"
                rel="noreferrer">
                {row.original.enterprise.website}
                <ExternalLinkIcon className="h-5 w-5" />
              </a>
            ) : (
              <span className="opacity-50">{tContacts('enterprise.table.emptyCells.website')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.taxId',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.taxId'),
          exportValue: (row: ResponseEnterpriseMemberDto) => row.enterprise?.taxId,
          filterKey: 'taxId',
          filterField: 'enterprise.taxId',
          filterType: 'string'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.taxId')}
            attribute="enterprise.taxId"
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.enterprise?.taxId || (
              <span className="opacity-50">{tContacts('enterprise.table.emptyCells.taxId')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.particular',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.particular.noun'),
          exportValue: (row: ResponseEnterpriseMemberDto) =>
            row.enterprise?.particular
              ? tContacts('enterprise.table.columns.particular.positive')
              : tContacts('enterprise.table.columns.particular.negative'),
          filterKey: 'particular',
          filterType: 'options',
          filterOptions: [
            {
              label: tContacts('enterprise.table.columns.particular.positive'),
              filter: 'enterprise.particular||$eq||1'
            },
            {
              label: tContacts('enterprise.table.columns.particular.negative'),
              filter: 'enterprise.particular||$eq||0'
            }
          ]
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.particular.noun')}
            attribute="enterprise.particular"
          />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.enterprise?.particular ? 'default' : 'outline'}>
            {row.original.enterprise?.particular
              ? tContacts('enterprise.table.columns.particular.positive')
              : tContacts('enterprise.table.columns.particular.negative')}
          </Badge>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.activity',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.activity'),
          exportValue: (row: ResponseEnterpriseMemberDto) => row.enterprise?.activity?.label,
          filterKey: 'activity',
          filterType: 'select',
          filterOptions: activityFilterOptions
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.attributes.activity')}
            attribute="enterprise.activityId"
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.enterprise?.activity?.label || (
              <span className="opacity-50">
                {tContacts('enterprise.table.emptyCells.activity')}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'isOwner',
        meta: {
          exportLabel: tUser('userManagement.details.systemEnterprises.columns.owner'),
          exportValue: (row: ResponseEnterpriseMemberDto) =>
            row.isOwner ? tUser('userManagement.details.systemEnterprises.proprietaryBadge') : ''
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tUser('userManagement.details.systemEnterprises.columns.owner')}
            attribute="isOwner"
          />
        ),
        cell: ({ row }) =>
          row.original.isOwner ? (
            <Badge variant="default">
              {tUser('userManagement.details.systemEnterprises.proprietaryBadge')}
            </Badge>
          ) : null,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.createdAt',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.createdAt'),
          exportValue: (row: ResponseEnterpriseMemberDto) =>
            row.enterprise?.createdAt ? new Date(row.enterprise.createdAt).toLocaleString() : '',
          filterKey: 'createdAt',
          filterField: 'enterprise.createdAt',
          filterType: 'date-range'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.createdAt')}
            attribute="enterprise.createdAt"
          />
        ),
        cell: ({ row }) => {
          const date = row.original.enterprise?.createdAt
            ? new Date(row.original.enterprise.createdAt)
            : null;
          return <DataTableCell variant={DataTableCellVariant.DATE_TIME} value={date} />;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'enterprise.updatedAt',
        meta: {
          exportLabel: tContacts('enterprise.table.columns.updatedAt'),
          exportValue: (row: ResponseEnterpriseMemberDto) =>
            row.enterprise?.updatedAt ? new Date(row.enterprise.updatedAt).toLocaleString() : '',
          filterKey: 'updatedAt',
          filterField: 'enterprise.updatedAt',
          filterType: 'date-range'
        },
        header: ({ column, table }) => (
          <DataTableColumnHeader
            column={column}
            context={(table.options.meta as any)?.context}
            title={tContacts('enterprise.table.columns.updatedAt')}
            attribute="enterprise.updatedAt"
          />
        ),
        cell: ({ row }) => {
          const date = row.original.enterprise?.updatedAt
            ? new Date(row.original.enterprise.updatedAt)
            : null;
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
    ],
    [tContacts, tUser, activityFilterOptions]
  );
};
