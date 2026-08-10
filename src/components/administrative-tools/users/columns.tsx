import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseUserDto } from '@/types';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { useTranslation } from 'react-i18next';
import { identifyUserAvatar } from '@/lib/user';
import UserAvatarCell from './UserAvatarCell';
import { DataTableCellVariant, DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';

export const useUserColumns = (
  context: DataTableConfig<ResponseUserDto>,
  t: (key: string) => string,
  roleFilterOptions?: DataTableColumnFilterOption[]
): ColumnDef<ResponseUserDto>[] => {
  const { t: tCommon } = useTranslation('common');

  return React.useMemo(
    () => [
      {
        accessorKey: `${t('userManagement.columns.photo')}`,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.photo')}
            attribute="photo"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <UserAvatarCell
            pictureId={row?.original?.pictureId}
            fallback={identifyUserAvatar(row?.original)}
          />
        ),
        enableSorting: false
      },
      {
        accessorKey: `${t('userManagement.columns.username')}`,
        meta: {
          filterKey: 'username',
          filterField: 'username',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.username')}
            attribute="username"
            context={context}
          />
        ),
        cell: ({ row }) => <div className="font-bold">{row.original.username}</div>,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.email')}`,
        meta: {
          filterKey: 'email',
          filterField: 'email',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.email')}
            attribute="email"
            context={context}
          />
        ),
        cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.firstName')}`,
        meta: {
          filterKey: 'firstName',
          filterField: 'firstName',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.firstName')}
            attribute="firstName"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.firstName || (
              <span className="opacity-70">{t('userManagement.errors.notDefined')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.lastName')}`,
        meta: {
          filterKey: 'lastName',
          filterField: 'lastName',
          filterType: 'string'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.lastName')}
            attribute="lastName"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.lastName || (
              <span className="opacity-70">{t('userManagement.errors.notDefined')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.dateOfBirth')}`,
        meta: {
          filterKey: 'dateOfBirth',
          filterField: 'dateOfBirth',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.dateOfBirth')}
            attribute="dateOfBirth"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {(row.original.dateOfBirth && format(row.original.dateOfBirth, 'yyyy-MM-dd')) || (
              <span className="opacity-70">{t('userManagement.errors.notDefined')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.role')}`,
        meta: {
          filterKey: 'role',
          filterType: 'select',
          filterMultiSelect: true,
          filterOptions: roleFilterOptions
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.role')}
            attribute="role.label"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original?.role.label || (
              <span className="opacity-70">{t('userManagement.errors.roleNotFound')}</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.isActive')}`,
        meta: {
          filterKey: 'isActive',
          filterType: 'options',
          filterOptions: [
            {
              label: tCommon('answer.yes'),
              filter: 'isActive||$eq||1'
            },
            {
              label: tCommon('answer.no'),
              filter: 'isActive||$eq||0'
            }
          ]
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.isActive')}
            attribute="isActive"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.isActive ? 'default' : 'secondary'}
            className={cn('font-bold')}>
            {row.original.isActive ? tCommon('answer.yes') : tCommon('answer.no')}
          </Badge>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.isApproved')}`,
        meta: {
          filterKey: 'isApproved',
          filterType: 'options',
          filterOptions: [
            {
              label: tCommon('answer.yes'),
              filter: 'isApproved||$eq||1'
            },
            {
              label: tCommon('answer.no'),
              filter: 'isApproved||$eq||0'
            }
          ]
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.isApproved')}
            attribute="isApproved"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.isApproved ? 'default' : 'secondary'}
            className={cn('font-bold')}>
            {row.original.isApproved ? tCommon('answer.yes') : tCommon('answer.no')}
          </Badge>
        ),
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: `${t('userManagement.columns.createdAt')}`,
        meta: {
          filterKey: 'createdAt',
          filterField: 'createdAt',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.createdAt')}
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
      },
      {
        accessorKey: `${t('userManagement.columns.updatedAt')}`,
        meta: {
          filterKey: 'updatedAt',
          filterField: 'updatedAt',
          filterType: 'date-range'
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('userManagement.columns.updatedAt')}
            attribute="updatedAt"
            context={context}
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
          <div className="flex justify-center">
            <DataTableRowActions row={row} context={context} />
          </div>
        )
      }
    ],
    [context, t, tCommon, roleFilterOptions]
  );
};
