import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Trash2, Unlink } from 'lucide-react';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';
import { buildDataTableFilterString } from '@/components/shared/data-table/column-filter';
import { ResponseEnterpriseMemberDto } from '@/types';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useActivities } from '@/hooks/content/core/useActivities';
import { getErrorMessage } from '@/utils/errors';
import { useUserSystemEnterpriseColumns } from './userSystemEnterpriseColumns';
import { useUserSystemEnterpriseDisassociateDialog } from './modals/UserSystemEnterpriseDisassociateDialog';
import { useUserSystemEnterpriseRemoveDialog } from './modals/UserSystemEnterpriseRemoveDialog';
import { useUserSystemEnterpriseAddSheet } from './modals/UserSystemEnterpriseAddSheet';

interface UserSystemEnterprisesTableProps {
  className?: string;
  userId: string;
}

export const UserSystemEnterprisesTable = ({
  className,
  userId
}: UserSystemEnterprisesTableProps) => {
  const router = useRouter();
  const { t: tUser } = useTranslation('user-management');
  const { t: tContacts } = useTranslation('contacts');

  const [selectedMembership, setSelectedMembership] =
    React.useState<ResponseEnterpriseMemberDto | null>(null);

  const {
    page,
    setPage,
    size,
    setSize,
    sortDetails,
    setSortDetails,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,

    tableReset
  } = useDataTableState('user-system-enterprises-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);
  const { value: debouncedColumnFilters, loading: filtering } = useDebounce<
    Record<string, string>
  >(columnFilters, 500);

  const filterString = React.useMemo(
    () => buildDataTableFilterString('', debouncedColumnFilters),
    [debouncedColumnFilters]
  );

  const {
    data: membershipsResp,
    isPending: isFetchPending,
    refetch: refetchMemberships
  } = useQuery({
    queryKey: [
      'user-system-enterprises',
      userId,
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters
    ],
    queryFn: () =>
      api.core.enterpriseMember.findPaginatedByUser(userId, {
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        filter: filterString
      }),
    enabled: Boolean(userId)
  });

  const memberships = React.useMemo(() => membershipsResp?.data || [], [membershipsResp]);

  const { mutate: disassociateMembership, isPending: isDisassociatePending } = useMutation({
    mutationFn: (id: number) => api.core.enterpriseMember.remove(id),
    onSuccess: () => {
      if (memberships.length === 1 && page > 1) setPage(page - 1);
      toast.success(tUser('userManagement.details.systemEnterprises.messages.disassociateSuccess'));
      refetchMemberships();
      setSelectedMembership(null);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          'user-management',
          error,
          tUser('userManagement.details.systemEnterprises.messages.disassociateFailure')
        )
      );
    }
  });

  const { mutate: removeEnterprise, isPending: isRemovePending } = useMutation({
    mutationFn: (id: number) => api.core.enterprise.remove(id),
    onSuccess: () => {
      if (memberships.length === 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('enterprise.action_remove_success'));
      refetchMemberships();
      setSelectedMembership(null);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('enterprise.action_remove_failure'))
      );
    }
  });

  const { disassociateDialog, openDisassociateDialog } = useUserSystemEnterpriseDisassociateDialog({
    representation: selectedMembership?.enterprise?.name,
    disassociate: () => {
      if (selectedMembership?.id) disassociateMembership(selectedMembership.id);
    },
    isPending: isDisassociatePending,
    reset: () => setSelectedMembership(null)
  });

  const { removeDialog, openRemoveDialog } = useUserSystemEnterpriseRemoveDialog({
    representation: selectedMembership?.enterprise?.name,
    removeEnterprise: () => {
      if (selectedMembership?.enterprise?.id) removeEnterprise(selectedMembership.enterprise.id);
    },
    isPending: isRemovePending,
    reset: () => setSelectedMembership(null)
  });

  const { addSystemEnterpriseSheet, openAddSystemEnterpriseSheet } =
    useUserSystemEnterpriseAddSheet({
      userId,
      onSuccess: () => refetchMemberships()
    });

  const context: DataTableConfig<ResponseEnterpriseMemberDto> = {
    singularName: tUser('userManagement.details.systemEnterprises.singular'),
    pluralName: tUser('userManagement.details.systemEnterprises.plural'),
    createCallback: () => openAddSystemEnterpriseSheet(),
    inspectCallback: (entity) => {
      if (entity.enterprise?.id) {
        router.push(`/contacts/enterprise/${entity.enterprise.id}`);
      }
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: membershipsResp?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    ...tableReset,
    columnFilters,
    setColumnFilter: (filterKey, filterParam) => {
      setPage(1);
      setColumnFilters((previous) => {
        if (!filterParam) {
          const { [filterKey]: _, ...rest } = previous;
          return rest;
        }
        return { ...previous, [filterKey]: filterParam };
      });
    },
    targetEntity: (entity) => setSelectedMembership(entity),
    additionalActions: {
      0: [
        {
          actionLabel: tUser('userManagement.details.systemEnterprises.actions.disassociate'),
          actionIcon: <Unlink className="size-4" />,
          actionCallback: (entity) => {
            setSelectedMembership(entity);
            openDisassociateDialog();
          }
        },
        {
          actionLabel: tUser('userManagement.details.systemEnterprises.actions.remove'),
          actionIcon: <Trash2 className="size-4" />,
          actionCallback: (entity) => {
            setSelectedMembership(entity);
            openRemoveDialog();
          }
        }
      ]
    },
    exportConfig: {
      enabled: true,
      filename: 'user-system-enterprises',
      fetchAll: () =>
        api.core.enterpriseMember.findPaginatedByUser(userId, {
          page: '1',
          limit: '1000',
          sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
          search: debouncedSearchTerm,
          filter: filterString
        }).then((response) => response.data)
    }
  };

  const { activities } = useActivities();
  const activityFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      activities.map((activity) => ({
        label: activity.label,
        filter: `enterprise.activityId||$eq||${activity.id}`
      })),
    [activities]
  );

  const columns = useUserSystemEnterpriseColumns(context, activityFilterOptions);

  const isPending =
    isFetchPending ||
    isDisassociatePending ||
    isRemovePending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    filtering;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={memberships}
        context={context}
        isPending={isPending}
      />
      {disassociateDialog}
      {removeDialog}
      {addSystemEnterpriseSheet}
    </div>
  );
};
