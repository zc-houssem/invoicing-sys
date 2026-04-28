import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useIntro } from '@/context/IntroContext';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useTemplateColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { useTemplateDeleteDialog } from './modals/TemplateDeleteDialog';
import { ResponseTemplateDto } from '@/types';

interface TemplatePortalProps {
  className?: string;
}

export const TemplatePortal = ({ className }: TemplatePortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.('Templates', 'Here you can manage your document templates.');
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.content_management') },
      { title: tCommon('settings.content_management.templates') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const templateStore = useTemplateStore();

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

  const {
    data: templatesResp,
    isPending: isFetchPending,
    refetch: refetchTemplates
  } = useQuery({
    queryKey: [
      'templates',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.template.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm
      })
  });

  const templates = React.useMemo(() => {
    return templatesResp?.data || [];
  }, [templatesResp]);

  // remove template
  const { mutate: removeTemplate, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: string) => api.core.template.remove(id),
    onSuccess: () => {
      if (templates?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContentManagement('template.action_remove_success'));
      refetchTemplates();
    },
    onError: (error) => {
      toast.error(getErrorMessage('content-management', error, 'template.action_remove_failure'));
    }
  });

  const { deleteTemplateDialog, openDeleteTemplateDialog, closeDeleteTemplateDialog } =
    useTemplateDeleteDialog({
      representation: templateStore?.response?.name,
      deleteTemplate: () => removeTemplate(templateStore?.response?.id),
      isDeletionPending: isDeletePending,
      reset: templateStore.reset
    });

  const context: DataTableConfig<ResponseTemplateDto> = {
    singularName: 'Template',
    pluralName: 'Templates',
    createCallback: () => {
      router.push('/content-management/templates/new');
    },
    updateCallback: (target: ResponseTemplateDto) => {
      router.push(`/content-management/templates/${target.id}`);
    },
    deleteCallback: () => {
      openDeleteTemplateDialog();
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: templatesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (entity) => {
      templateStore.set('response', entity);
      templateStore.set('updateDto', {
        name: entity.name,
        description: entity.description,
        documentId: entity.document?.id,
        variables: entity.variables
      });
    }
  };

  const columns = useTemplateColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={templates}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {deleteTemplateDialog}
    </div>
  );
};
