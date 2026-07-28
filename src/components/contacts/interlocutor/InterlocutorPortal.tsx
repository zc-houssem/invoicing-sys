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
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';

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
      setIntro?.(
        tContacts('interlocutor.plural'),
        tContacts('interlocutor.detailmenu.description').replace(
          '{{interlocutorName}}',
          'les interlocuteurs'
        )
      );
      setRoutes?.([
        { title: tCommon('menu.contacts.title'), href: '/contacts' },
        { title: tCommon('menu.contacts.subs.interlocutors') }
      ]);
    }
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const interlocutorStore = useInterlocutorStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

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
      enterpriseId
    ],
    queryFn: () =>
      api.core.interlocutor.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        join: enterpriseId ? 'enterpriseInterlocutors' : '',
        enterpriseId
      })
  });

  const interlocutors = React.useMemo(() => {
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

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
      interlocutorStore.set('updateDto', {
        title: entity.title,
        firstName: entity.firstName,
        lastName: entity.lastName,
        phone: entity.phone,
        email: entity.email
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
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const { createInterlocutorSheet, openCreateInterlocutorSheet, closeCreateInterlocutorSheet } =
    useInterlocutorCreateSheet(() => interlocutorStore.reset());

  const { updateInterlocutorSheet, openUpdateInterlocutorSheet, closeUpdateInterlocutorSheet } =
    useInterlocutorUpdateSheet(() => interlocutorStore.reset());

  const columns = useInterlocutorColumns(context, enterpriseId);

  const isPending = isFetchPending || paging || resizing || searching || sorting;

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
    </div>
  );
};
