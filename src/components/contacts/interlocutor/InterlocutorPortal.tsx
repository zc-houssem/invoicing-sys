import { api } from '@/api';
import { ResponseInterlocutorDto } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useInterlocutorCreateSheet } from './modals/InterlocutorCreateSheet';
import { useInterlocutorUpdateSheet } from './modals/InterlocutorUpdateSheet';
import { useInterlocutorColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { buildDataTableFilterString } from '@/components/shared/data-table/column-filter';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { useInterlocutorDeleteDialog } from './modals/InterlocutorDeleteDialog';
import { useInterlocutorDisassociateDialog } from './modals/InterlocutorDisassociateDialog';
import { Unlink } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useMutation } from '@tanstack/react-query';
import { useDataTableState } from '@/hooks/other/useDataTableState';

interface InterlocutorPortalProps {
  className?: string;
  enterpriseId?: number;
}

export const InterlocutorPortal = ({ className, enterpriseId }: InterlocutorPortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    if (!enterpriseId) {
      setIntro?.(tContacts('page.interlocutors.title'), tContacts('page.interlocutors.description'));
      setRoutes?.([
        { title: tCommon('menu.contacts.title'), href: '/contacts' },
        { title: tCommon('menu.contacts.subs.interlocutors') }
      ]);

      return () => {
        clearIntro?.();
        clearRoutes?.();
      };
    }
  }, [router.locale, enterpriseId, tCommon, tContacts, setIntro, clearIntro, setRoutes, clearRoutes]);

  const interlocutorStore = useInterlocutorStore();

    const {
    page, setPage,
    size, setSize,
    sortDetails, setSortDetails,
    searchTerm, setSearchTerm,
    columnFilters, setColumnFilters
  } = useDataTableState('interlocutorportal-table', { order: true, sortKey: 'id' });

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

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: interlocutorsResp,
    refetch: refetchInterlocutors
  } = useQuery({
    queryKey: [
      'interlocutors',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters,
      enterpriseId
    ],
    queryFn: () =>
      api.core.interlocutor.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        filter: filterString,
        join: enterpriseId ? 'enterpriseInterlocutors' : '',
        enterpriseId
      })
  });

  const interlocutors = React.useMemo(() => {
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

  const { mutate: removeInterlocutor, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.core.interlocutor.remove(id),
    onSuccess: () => {
      if (interlocutors?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('interlocutor.action_remove_success'));
      refetchInterlocutors();
      interlocutorStore.reset();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_remove_failure'))
      );
    }
  });

  const { mutate: disassociateInterlocutor, isPending: isDisassociatePending } = useMutation({
    mutationFn: (id: number) => api.core.enterpriseInterlocutor.remove(id),
    onSuccess: () => {
      toast.success(tContacts('interlocutor.action_disassociate_success'));
      refetchInterlocutors();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_disassociate_failure'))
      );
    }
  });

  const { deleteInterlocutorDialog, openDeleteInterlocutorDialog } = useInterlocutorDeleteDialog(
    `${interlocutorStore?.response?.firstName || ''} ${interlocutorStore?.response?.lastName || ''}`,
    () => {
      if (interlocutorStore?.response?.id) {
        removeInterlocutor(interlocutorStore.response.id);
      }
    },
    isDeletePending
  );

  const { disassociateInterlocutorDialog, openDisassociateInterlocutorDialog } =
    useInterlocutorDisassociateDialog(
      `${interlocutorStore?.response?.firstName || ''} ${interlocutorStore?.response?.lastName || ''}`,
      (id?: number) => {
        if (id) {
          disassociateInterlocutor(id);
        }
      },
      isDisassociatePending
    );

  const context: DataTableConfig<ResponseInterlocutorDto> = {
    singularName: tContacts('interlocutor.singular'),
    pluralName: tContacts('interlocutor.plural'),
    inspectCallback: (entity: ResponseInterlocutorDto) => {
      router.push(`/contacts/interlocutor/${entity.id}`);
    },
    createCallback: () => {
      interlocutorStore.reset();
      openCreateInterlocutorSheet();
    },
    updateCallback: (entity: ResponseInterlocutorDto) => {
      interlocutorStore.set('response', entity);

      let position = '';
      let enterpriseInterlocutorId = undefined;

      if (enterpriseId) {
        const ei = entity.enterpriseInterlocutors?.find(
          (e: any) => e.enterpriseId === enterpriseId
        );
        enterpriseInterlocutorId = ei?.id;
        position = ei?.position || '';
      }

      interlocutorStore.set('enterpriseInterlocutorId', enterpriseInterlocutorId);
      interlocutorStore.set('updateDto', {
        title: entity.title,
        firstName: entity.firstName,
        lastName: entity.lastName,
        phone: entity.phone,
        email: entity.email,
        position
      });
      openUpdateInterlocutorSheet();
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: interlocutorsResp?.meta.pageCount || 0,
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
    deleteCallback: (entity: ResponseInterlocutorDto) => {
      interlocutorStore.set('response', entity);
      openDeleteInterlocutorDialog();
    },
    additionalActions: enterpriseId
      ? {
          0: [
            {
              actionLabel: tCommon('commands.unassociate'),
              actionIcon: <Unlink className="size-4" />,
              actionCallback: (entity: ResponseInterlocutorDto) => {
                const ei = entity.enterpriseInterlocutors?.find(
                  (e: any) => e.enterpriseId === enterpriseId
                );
                if (ei?.id) {
                  interlocutorStore.set('response', entity);
                  interlocutorStore.set('enterpriseInterlocutorId', ei.id);
                  openDisassociateInterlocutorDialog();
                }
              }
            }
          ]
        }
      : undefined,
    exportConfig: {
      enabled: true,
      filename: 'Interlocutors',
      fetchAll: () =>
        api.core.interlocutor.findAll({
          sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
          search: debouncedSearchTerm,
          filter: filterString
        })
    }
  };

  const { createInterlocutorSheet, openCreateInterlocutorSheet, closeCreateInterlocutorSheet } =
    useInterlocutorCreateSheet(() => interlocutorStore.reset(), enterpriseId);

  const { updateInterlocutorSheet, openUpdateInterlocutorSheet, closeUpdateInterlocutorSheet } =
    useInterlocutorUpdateSheet(() => interlocutorStore.reset(), enterpriseId);

  const columns = useInterlocutorColumns(context, enterpriseId);

  const isPending =
    isFetchPending ||
    isDeletePending ||
    isDisassociatePending ||
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
        data={interlocutors}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createInterlocutorSheet}
      {updateInterlocutorSheet}
      {deleteInterlocutorDialog}
      {disassociateInterlocutorDialog}
    </div>
  );
};
