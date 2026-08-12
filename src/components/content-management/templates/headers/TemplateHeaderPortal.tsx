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
import { useTemplateHeaderColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useTemplateHeaderDeleteDialog } from './modals/TemplateHeaderDeleteDialog';
import { ResponseTemplateHeaderDto } from '@/types';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';
import { CardView, CommonCard } from '@/components/shared/data-table/card-view';
import { useUpload } from '@/hooks/useUpload';

interface TemplateHeaderPortalProps {
  className?: string;
}

const TemplateHeaderCard = ({
  item,
  onClick
}: {
  item: ResponseTemplateHeaderDto;
  onClick: () => void;
}) => {
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

export const TemplateHeaderPortal = ({ className }: TemplateHeaderPortalProps) => {
  const router = useRouter();

  const { t: tCommon, i18n } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('table');

  React.useEffect(() => {
    setIntro?.(
      tContentManagement('templateHeader.page.title', { defaultValue: 'Headers' }),
      tContentManagement('templateHeader.page.description', {
        defaultValue: 'Here you can manage your document headers.'
      })
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.headers', { defaultValue: 'Headers' }) }
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

  const templateHeaderStore = useTemplateHeaderStore();

  const {
    page,
    setPage,
    size,
    setSize,
    sortDetails,
    setSortDetails,
    searchTerm,
    setSearchTerm,
    tableReset
  } = useDataTableState('templateHeaderportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: templateHeadersResp,
    isPending: isFetchPending,
    refetch: refetchTemplateHeaders
  } = useQuery({
    queryKey: [
      'templateHeaders',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.templateHeader.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm,
        join: 'templateType'
      })
  });

  const templateHeaders = React.useMemo(() => {
    return templateHeadersResp?.data || [];
  }, [templateHeadersResp]);

  const { mutate: removeTemplateHeader, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: string) => api.core.templateHeader.remove(id),
    onSuccess: () => {
      if (templateHeaders?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContentManagement('templateHeader.action_remove_success'));
      refetchTemplateHeaders();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('content-management', error, 'templateHeader.action_remove_failure')
      );
    }
  });

  const { deleteTemplateHeaderDialog, openDeleteTemplateHeaderDialog } =
    useTemplateHeaderDeleteDialog({
      representation: templateHeaderStore?.response?.name,
      deleteTemplateHeader: () => removeTemplateHeader(templateHeaderStore?.response?.id),
      isDeletionPending: isDeletePending,
      reset: templateHeaderStore.reset
    });

  const context: DataTableConfig<ResponseTemplateHeaderDto> = {
    singularName: 'Header',
    pluralName: 'Headers',
    createCallback: () => {
      router.push('/content-management/pdf/headers/new');
    },
    updateCallback: (target: ResponseTemplateHeaderDto) => {
      router.push(`/content-management/pdf/headers/${target.id}`);
    },
    deleteCallback: () => {
      openDeleteTemplateHeaderDialog();
    },
    additionalActions: {},
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: templateHeadersResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    ...tableReset,
    targetEntity: (entity) => {
      templateHeaderStore.set('response', entity);
      templateHeaderStore.set('updateDto', {
        name: entity.name,
        description: entity.description,
        ejsCode: entity.ejsCode,
        previewPictureId: entity.previewPictureId
      });
    }
  };

  const columns = useTemplateHeaderColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      {viewMode === 'table' ? (
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={templateHeaders}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <CardView
            data={templateHeaders}
            renderCard={(item) => (
              <TemplateHeaderCard
                key={item.id}
                item={item}
                onClick={() => context.updateCallback?.(item)}
              />
            )}
          />
        </div>
      )}
      {deleteTemplateHeaderDialog}
    </div>
  );
};
