import { api } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useEnterpriseColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { ResponseEnterpriseDto } from '@/types';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { EnterpriseDeleteDialog } from './modal/EnterpriseDeleteDialog';

interface EnterprisePortalProps {
  className?: string;
}

export const EnterprisePortal = ({ className }: EnterprisePortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setIntro?.(
      tCommon('routes.contacts.enterprise.title'),
      tCommon('routes.contacts.enterprise.description')
    );
    setRoutes?.([
      { title: tCommon('menu.contacts'), href: '/contacts' },
      { title: tCommon('submenu.enterprises') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const enterpriseStore = useEnterpriseStore();

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
    data: enterprisesResp,
    refetch: refetchEnterprises
  } = useQuery({
    queryKey: [
      'enterprises',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.enterprise.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm
      })
  });

  const enterprises = React.useMemo(() => {
    return enterprisesResp?.data || [];
  }, [enterprisesResp]);

  const { mutate: removeEnterprise, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.core.enterprise.remove(id),
    onSuccess: () => {
      if (enterprises?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('enterprise.action_remove_success'));
      refetchEnterprises();
      enterpriseStore.reset();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('enterprise.action_remove_failure'))
      );
    }
  });

  const context: DataTableConfig<ResponseEnterpriseDto> = {
    singularName: tContacts('enterprise.singular'),
    pluralName: tContacts('enterprise.plural'),
    inspectCallback: (entity: ResponseEnterpriseDto) => {
      router.push(`/contacts/enterprise/${entity.id}`);
    },
    createCallback: () => {
      router.push('/contacts/new-enterprise');
    },
    updateCallback: () => {},
    deleteCallback: () => {
      setDeleteDialog(true);
    },
    additionalActions: {},
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: enterprisesResp?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (enterprise: ResponseEnterpriseDto) => {
      enterpriseStore.set('id', enterprise.id);
    }
  };

  const columns = useEnterpriseColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden container mx-auto', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={enterprises}
        columns={columns}
        context={context}
        isPending={isPending}
      />

      <EnterpriseDeleteDialog
        open={deleteDialog}
        deleteEnterprise={() => {
          enterpriseStore?.id && removeEnterprise(enterpriseStore?.id);
          setDeleteDialog(false);
        }}
        isDeletionPending={isDeletePending}
        label={enterpriseStore?.name}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
    </div>
  );
};
