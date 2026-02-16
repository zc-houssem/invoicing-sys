import { api } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { FirmDeleteDialog } from './dialogs/FirmDeleteDialog';
import { useFirmManager } from '@/components/contacts/firm/hooks/useFirmManager';
import { useFirmColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { Firm } from '@/types';

interface FirmPortalProps {
  className?: string;
}

export const FirmPortal = ({ className }: FirmPortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setIntro?.(tCommon('routes.contacts.firm.title'), tCommon('routes.contacts.firm.description'));
    setRoutes?.([
      { title: tCommon('menu.contacts'), href: '/contacts' },
      { title: tCommon('submenu.firms') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const firmManager = useFirmManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
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
    data: firmsResp,
    refetch: refetchFirms
  } = useQuery({
    queryKey: [
      'firms',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.firm.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const firms = React.useMemo(() => {
    return firmsResp?.data || [];
  }, [firmsResp]);

  const { mutate: removeFirm, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.firm.remove(id),
    onSuccess: () => {
      if (firms?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('firm.action_remove_success'));
      refetchFirms();
      firmManager.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage('contacts', error, tContacts('firm.action_remove_failure')));
    }
  });

  const context: DataTableConfig<Firm> = {
    singularName: tContacts('firm.singular'),
    pluralName: tContacts('firm.plural'),
    inspectCallback: () => {
      
    },
    createCallback: () => {
      router.push('/contacts/new-firm');
    },
    updateCallback: () => {},
    deleteCallback: () => {},
    additionalActions: {},
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: firmsResp?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const columns = useFirmColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={firms}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {/*       
      <FirmDeleteDialog
        open={deleteDialog}
        deleteFirm={() => {
          firmManager?.id && removeFirm(firmManager?.id);
          setDeleteDialog(false);
        }}
        isDeletionPending={isDeletePending}
        label={firmManager?.name}
        onClose={() => {
          setDeleteDialog(false);
        }}
      /> */}
    </div>
  );
};
