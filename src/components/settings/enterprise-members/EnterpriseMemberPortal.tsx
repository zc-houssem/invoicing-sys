import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useEnterpriseMemberColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { ResponseEnterpriseMemberDto } from '@/types';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { useEnterpriseMemberCreateSheet } from './modals/EnterpriseMemberCreateSheet';
import { useEnterpriseMemberRemoveDialog } from './modals/EnterpriseMemberRemoveDialog';
import { useEnterpriseMemberMakeProprietaryDialog } from './modals/EnterpriseMemberMakeProprietaryDialog';
import { Crown } from 'lucide-react';

interface EnterpriseMemberPortalProps {
  className?: string;
}

export const EnterpriseMemberPortal = ({ className }: EnterpriseMemberPortalProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { activeCompanyId } = useActiveCompanyContext();

  const [selectedMember, setSelectedMember] = React.useState<ResponseEnterpriseMemberDto | null>(
    null
  );

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
    setColumnFilters
  } = useDataTableState('enterprise-member-portal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: membersResp,
    isPending: isFetchPending,
    refetch: refetchMembers
  } = useQuery({
    queryKey: [
      'enterprise-members',
      activeCompanyId,
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.enterpriseMember.findPaginated(activeCompanyId as number, {
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm
      }),
    enabled: !!activeCompanyId
  });

  const members = React.useMemo(() => membersResp?.data || [], [membersResp]);

  const { mutate: removeMember, isPending: isRemovePending } = useMutation({
    mutationFn: (id: number) => api.core.enterpriseMember.remove(id),
    onSuccess: () => {
      if (members.length === 1 && page > 1) setPage(page - 1);
      toast.success(tSettings('members.messages.removeSuccess'));
      refetchMembers();
      setSelectedMember(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage('settings', error, tSettings('members.messages.removeFailure')));
    }
  });

  const { mutate: makeProprietary, isPending: isMakeProprietaryPending } = useMutation({
    mutationFn: (id: number) => api.core.enterpriseMember.update(id, { isOwner: true }),
    onSuccess: () => {
      toast.success(tSettings('members.messages.makeProprietarySuccess'));
      refetchMembers();
      setSelectedMember(null);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('settings', error, tSettings('members.messages.makeProprietaryFailure'))
      );
    }
  });

  const { removeMemberDialog, openRemoveMemberDialog } = useEnterpriseMemberRemoveDialog({
    representation: selectedMember?.user
      ? `${selectedMember.user.firstName || ''} ${selectedMember.user.lastName || ''}`.trim() ||
        selectedMember.user.email
      : '',
    removeMember: () => {
      if (selectedMember?.id) removeMember(selectedMember.id);
    },
    isRemovePending,
    reset: () => setSelectedMember(null)
  });

  const { makeProprietaryDialog, openMakeProprietaryDialog } =
    useEnterpriseMemberMakeProprietaryDialog({
      representation: selectedMember?.user
        ? `${selectedMember.user.firstName || ''} ${selectedMember.user.lastName || ''}`.trim() ||
          selectedMember.user.email
        : '',
      makeProprietary: () => {
        if (selectedMember?.id) makeProprietary(selectedMember.id);
      },
      isPending: isMakeProprietaryPending,
      reset: () => setSelectedMember(null)
    });

  const { createMemberSheet, openCreateMemberSheet } = useEnterpriseMemberCreateSheet({
    enterpriseId: activeCompanyId ?? undefined,
    onSuccess: () => refetchMembers()
  });

  const context: DataTableConfig<ResponseEnterpriseMemberDto> = {
    singularName: tSettings('members.singular'),
    pluralName: tSettings('members.plural'),
    createCallback: () => openCreateMemberSheet(),
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: membersResp?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
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
    deleteCallback: (entity: ResponseEnterpriseMemberDto) => {
      setSelectedMember(entity);
      openRemoveMemberDialog();
    },
    additionalActions: {
      0: [
        {
          actionLabel: tSettings('members.actions.makeProprietary'),
          actionIcon: <Crown className="size-4" />,
          actionCallback: (entity: ResponseEnterpriseMemberDto) => {
            setSelectedMember(entity);
            openMakeProprietaryDialog();
          },
          isActionVisible: (entity: ResponseEnterpriseMemberDto) => !entity.isOwner
        }
      ]
    }
  };

  const columns = useEnterpriseMemberColumns(context);

  const isPending =
    isFetchPending ||
    isRemovePending ||
    isMakeProprietaryPending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (!activeCompanyId) {
    return (
      <div className="p-4 text-muted-foreground">
        {tCommon('errors.no_active_company', 'No active enterprise selected.')}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={members}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createMemberSheet}
      {removeMemberDialog}
      {makeProprietaryDialog}
    </div>
  );
};
