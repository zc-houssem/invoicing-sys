import { api } from '@/api';
import { CreateInterlocutorDto, Interlocutor, UpdateInterlocutorDto } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useInterlocutorDeleteDialog } from './modals/InterlocutorDeleteDialog';
import { useInterlocutorCreateOrAssociateSheet } from './modals/InterlocutorCreateOrAssociateSheet';
import { useInterlocutorUpdateSheet } from './modals/InterlocutorUpdateSheet';
import { useInterlocutorPromoteDialog } from './modals/InterlocutorPromoteDialog';
import { useInterlocutorDisassociateDialog } from './modals/InterlocutorDisassociateDialog';
import { useInterlocutorColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { ArrowUp, Trash2, Unlink } from 'lucide-react';

interface InterlocutorPortalProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorPortal = ({ className, firmId }: InterlocutorPortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    if (!firmId) {
      setIntro?.(
        tCommon('routes.contacts.interlocutor.title'),
        tCommon('routes.contacts.interlocutor.description')
      );
      setRoutes?.([
        { title: tCommon('menu.contacts'), href: '/contacts' },
        { title: tCommon('submenu.interlocutors') }
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
      firmId
    ],
    queryFn: () =>
      api.core.interlocutor.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm
      })
  });

  const interlocutors = React.useMemo(() => {
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

  const context: DataTableConfig<Interlocutor> = {
    singularName: tContacts('interlocutor.singular'),
    pluralName: tContacts('interlocutor.plural'),
    inspectCallback: (entity: Interlocutor) => {
      router.push(`/contacts/interlocutor/${entity.id}`);
    },
    createCallback: () => {},
    updateCallback: () => {},
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
    targetEntity: (interlocutor: Interlocutor) => {
      interlocutorStore.setInterlocutor(interlocutor, firmId);
    }
  };

  const columns = useInterlocutorColumns(context, firmId);

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
    </div>
  );
};
