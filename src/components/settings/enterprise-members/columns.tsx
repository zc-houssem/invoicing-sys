import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseEnterpriseMemberDto } from '@/types';

export const useEnterpriseMemberColumns = (
  context: DataTableConfig<ResponseEnterpriseMemberDto>
): ColumnDef<ResponseEnterpriseMemberDto>[] => {
  const { t } = useTranslation('settings');

  return [
    {
      accessorKey: 'user.firstName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('members.table.columns.name')}
          attribute={'user.firstName'}
        />
      ),
      cell: ({ row }) => (
        <div>
          {[row.original.user?.firstName, row.original.user?.lastName]
            .filter(Boolean)
            .join(' ') || row.original.user?.username}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'user.email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('members.table.columns.email')}
          attribute={'user.email'}
        />
      ),
      cell: ({ row }) => <div>{row.original.user?.email}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'user.role.label',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('members.table.columns.role')}
          attribute={'user.role.label'}
        />
      ),
      cell: ({ row }) => <div>{row.original.user?.role?.label}</div>,
      enableSorting: false,
      enableHiding: true
    },
    {
      accessorKey: 'isOwner',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('members.table.columns.owner')}
          attribute={'isOwner'}
        />
      ),
      cell: ({ row }) =>
        row.original.isOwner ? (
          <Badge variant="default">{t('members.table.proprietaryBadge')}</Badge>
        ) : null,
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} context={context} />
    }
  ];
};
