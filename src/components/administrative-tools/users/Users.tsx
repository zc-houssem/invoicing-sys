import React from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUserColumns } from './columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useUserDeleteDialog } from './modals/UserDeleteDialog';
import { useActivateUserDialog } from './modals/UserActivateDialog';
import { useDeactivateUserDialog } from './modals/UserDeactivateDialog';
import { ResponseUserDto, ServerErrorResponse, UpdateUserDto } from '@/types';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useApproveUserDialog } from './modals/UserApproveDialog';
import { useDisapproveUserDialog } from './modals/UserDisapproveDialog';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { DataTableColumnFilterOption, DataTableConfig } from '@/components/shared/data-table/types';
import { buildDataTableFilterString } from '@/components/shared/data-table/column-filter';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useRoles } from '@/hooks/content/useRoles';

interface UsersProps {
  className?: string;
}

export const Users = ({ className }: UsersProps) => {
  const router = useRouter();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  const { t, ready } = useTranslation('user-management');
  React.useEffect(() => {
    setRoutes?.([
      { title: t('userManagement.page.title') },
      {
        title: t('userManagement.page.users'),
        href: '/administrative-tools/user-management/users'
      }
    ]);
    setIntro?.(t('userManagement.page.users'), t('userManagement.page.description'));
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, [ready, t]);

  const userStore = useUserStore();

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
  } = useDataTableState('users-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);
  const { value: debouncedColumnFilters, loading: filtering } = useDebounce<Record<string, string>>(
    columnFilters,
    500
  );

  const filterString = React.useMemo(
    () => buildDataTableFilterString('', debouncedColumnFilters),
    [debouncedColumnFilters]
  );

  const {
    data: usersResponse,
    isFetching: isUsersPending,
    refetch: refetchUsers
  } = useQuery({
    queryKey: [
      'users',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters
    ],
    queryFn: () =>
      api.admin.user.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        filter: filterString
      })
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.data;
  }, [usersResponse]);

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.remove(id),
    onSuccess: () => {
      toast(t('userManagement.messages.userDeletedSuccess'));
      refetchUsers();
    },
    onError: (error) => toast(error.message)
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.activate(id),
    onSuccess: () => {
      toast(t('userManagement.messages.userActivatedSuccess'));
      refetchUsers();
    },
    onError: (error) => toast(error.message)
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.deactivate(id),
    onSuccess: () => {
      toast(t('userManagement.messages.userDeactivatedSuccess'));
      refetchUsers();
    },
    onError: (error) => toast(error.message)
  });

  const { mutate: approveUser, isPending: isApprovalPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.approve(id),
    onSuccess: () => {
      toast(t('userManagement.messages.userApprovedSuccess'));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    }
  });

  const { mutate: disapproveUser, isPending: isDisapprovalPending } = useMutation({
    mutationFn: (id?: string) => api.admin.user.disapprove(id),
    onSuccess: () => {
      toast(t('userManagement.messages.userDisapprovedSuccess'));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    }
  });

  const handleReset = () => {
    userStore.reset();
  };

  const { deleteUserDialog, openDeleteUserDialog } = useUserDeleteDialog({
    userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    deleteUser: () => deleteUser(userStore.response?.id),
    isDeletePending: isDeletionPending
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    activateUser: () => activateUser(userStore.response?.id),
    isActivationPending,
    resetUser: handleReset
  });

  const { deactivateUserDialog, openDeactivateUserDialog } = useDeactivateUserDialog({
    userFullname: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    deactivateUser: () => deactivateUser(userStore.response?.id),
    isDeactivationPending,
    resetUser: () => userStore.reset()
  });

  const { approveUserDialog, openApproveUserDialog } = useApproveUserDialog({
    representation: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    approveUser: () => approveUser(userStore.response?.id),
    isApprovalPending,
    resetUser: () => userStore.reset()
  });

  const { disapproveUserDialog, openDisapproveUserDialog } = useDisapproveUserDialog({
    representation: `${userStore.response?.firstName} - ${userStore.response?.lastName}`,
    disapproveUser: () => disapproveUser(userStore.response?.id),
    isDisapprovalPending,
    resetUser: () => userStore.reset()
  });

  const context: DataTableConfig<ResponseUserDto> = {
    singularName: `${t('userManagement.page.user')}`,
    pluralName: `${t('userManagement.page.users')}`,
    inspectCallback: (entity: ResponseUserDto) =>
      router.push(`/administrative-tools/user-management/users/${entity.id}`),
    createCallback: () => router.push('/administrative-tools/user-management/users/new'),
    updateCallback: (entity: ResponseUserDto) =>
      router.push(`/administrative-tools/user-management/users/${entity.id}/edit`),
    deleteCallback: openDeleteUserDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openActivateUserDialog,
          actionLabel: t('userManagement.page.activate'),
          actionIcon: <ArrowUp />,
          isActionVisible: (user: ResponseUserDto) => !user.isActive
        },
        {
          actionCallback: openDeactivateUserDialog,
          actionLabel: t('userManagement.page.deactivate'),
          actionIcon: <ArrowDown />,
          isActionVisible: (user: ResponseUserDto) => !!user.isActive
        },
        {
          actionCallback: openApproveUserDialog,
          actionLabel: t('userManagement.page.approve'),
          actionIcon: <ArrowUp />,
          isActionVisible: (user: ResponseUserDto) => !user.isApproved
        },
        {
          actionCallback: openDisapproveUserDialog,
          actionLabel: t('userManagement.page.disapprove'),
          actionIcon: <ArrowDown />,
          isActionVisible: (user: ResponseUserDto) => !!user.isApproved
        }
      ]
    },
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: usersResponse?.meta.pageCount || 0,
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
    targetEntity: (user: ResponseUserDto) => {
      userStore.set('response', user);
      userStore.set<UpdateUserDto>('updateDto', {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isActive: user.isActive,
        isApproved: user.isApproved,
        username: user.username,
        email: user.email,
        password: '',
        roleId: user.roleId,
        pictureId: user?.pictureId
      });
    }
  };

  const { roles } = useRoles();
  const roleFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      roles.map((role) => ({
        label: role.label,
        filter: `roleId||$eq||${role.id}`
      })),
    [roles]
  );

  const columns = useUserColumns(context, t, roleFilterOptions);

  const isPending =
    isUsersPending || paging || resizing || searching || sorting || filtering;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={users}
        context={context}
        isPending={isPending}
      />
      {deleteUserDialog}
      {activateUserDialog}
      {deactivateUserDialog}
      {approveUserDialog}
      {disapproveUserDialog}
    </div>
  );
};
