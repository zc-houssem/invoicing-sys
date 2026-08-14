import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { ResponseRoleDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatPermissionLabel } from './utils';

export const useRoleColumns = (
  context: DataTableConfig<ResponseRoleDto>
): ColumnDef<ResponseRoleDto>[] => {
  const { t } = useTranslation('role');
  const { t: tCommon } = useTranslation('common');
  return [
    {
      accessorKey: `${t('columns.label')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.label')}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('columns.description')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.description')}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.description || t('columns.noDescription')}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: `${t('columns.permissions')}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('columns.permissions')}
          attribute="permissions"
          context={context}
        />
      ),
      cell: ({ row }) => {
        // Ensure `entries` is always an array to prevent undefined errors
        const entries = row.original.permissions.map((p) => p.permission) ?? [];

        if (entries.length === 0) {
          return <div className="opacity-70">{t('columns.noPermissions')}</div>;
        }

        const visiblePermissions = entries.slice(0, 2); // Show first 2 permissions
        const hiddenPermissions = entries.slice(2);
        return (
          <div className="flex flex-wrap gap-1">
            {visiblePermissions.map((entry, index) => (
              <Badge key={index} variant="secondary" className="font-normal whitespace-nowrap">
                {formatPermissionLabel(entry?.label) || tCommon('general.unknown')}
              </Badge>
            ))}
            {hiddenPermissions.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer font-normal whitespace-nowrap">
                      +{hiddenPermissions.length} {tCommon('general.more')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex flex-wrap gap-1 max-h-64 overflow-y-auto max-w-sm bg-card shadow-md p-2">
                    {hiddenPermissions.map((entry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="font-normal justify-center whitespace-nowrap">
                        {formatPermissionLabel(entry?.label) || tCommon('general.unknown')}
                      </Badge>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      enableSorting: false,
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
  ];
};
