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
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';
import { CardView, CommonCard } from '@/components/shared/data-table/card-view';
import { useUpload } from '@/hooks/useUpload';

interface TemplatePortalProps {
  className?: string;
}

const TemplateCard = ({ item, onClick }: { item: ResponseTemplateDto; onClick: () => void }) => {
  const { url } = useUpload({ uploadId: item.previewPictureId });

  return (
    <CommonCard
      title={item.name}
      description={item.description}
      imageUrl={url ?? undefined}
      onClick={onClick}
    />
  );
};

export const TemplatePortal = ({ className }: TemplatePortalProps) => {
  const router = useRouter();

  const { t: tCommon, i18n } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('table');

  React.useEffect(() => {
    setIntro?.(
      tContentManagement('template.page.title', { defaultValue: 'Templates' }),
      tContentManagement('template.page.description', {
        defaultValue: 'Here you can manage your document templates.'
      })
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tCommon('menu.contentManagement.subs.templates') }
    ]);

    setFloating?.(
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(v) => v && setViewMode(v as 'table' | 'card')}>
        <ToggleGroupItem value="table" aria-label="Table View">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="card" aria-label="Card View">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    );

    return () => {
      clearIntro?.();
      clearRoutes?.();
      clearFloating?.();
    };
  }, [
    router.locale,
    i18n.language,
    tCommon,
    tContentManagement,
    setIntro,
    clearIntro,
    setRoutes,
    clearRoutes,
    viewMode,
    setFloating,
    clearFloating
  ]);

  const templateStore = useTemplateStore();

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
  } = useDataTableState('templateportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

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

  // print removed — PDFs are generated on the server when printing invoices/quotations

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
      router.push('/content-management/pdf/templates/new');
    },
    updateCallback: (target: ResponseTemplateDto) => {
      router.push(`/content-management/pdf/templates/${target.id}`);
    },
    deleteCallback: () => {
      openDeleteTemplateDialog();
    },
    additionalActions: {},
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
    ...tableReset,
    targetEntity: (entity) => {
      templateStore.set('response', entity);
      templateStore.set('updateDto', {
        name: entity.name,
        description: entity.description,
        documentId: entity.document?.id,
        variables: JSON.stringify(entity.variables)
      });
    }
  };

  const columns = useTemplateColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      {viewMode === 'table' ? (
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={templates}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <CardView
            data={templates}
            renderCard={(item) => (
              <TemplateCard
                key={item.id}
                item={item}
                onClick={() => context.updateCallback?.(item)}
              />
            )}
          />
        </div>
      )}
      {deleteTemplateDialog}
    </div>
  );
};
