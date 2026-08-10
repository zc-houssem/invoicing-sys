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
import { useTemplateFooterColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useTemplateFooterDeleteDialog } from './modals/TemplateFooterDeleteDialog';
import { ResponseTemplateFooterDto } from '@/types';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';
import { CardView, CommonCard } from '@/components/shared/data-table/card-view';
import { useUpload } from '@/hooks/useUpload';

interface TemplateFooterPortalProps {
  className?: string;
}

const TemplateFooterCard = ({
  item,
  onClick
}: {
  item: ResponseTemplateFooterDto;
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

export const TemplateFooterPortal = ({ className }: TemplateFooterPortalProps) => {
  const router = useRouter();

  const { t: tCommon, i18n } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('table');

  React.useEffect(() => {
    setIntro?.(
      tContentManagement('templateFooter.page.title', { defaultValue: 'Footers' }),
      tContentManagement('templateFooter.page.description', {
        defaultValue: 'Here you can manage your document footers.'
      })
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.footers', { defaultValue: 'Footers' }) }
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

  const templateFooterStore = useTemplateFooterStore();

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
  } = useDataTableState('templateFooterportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: templateFootersResp,
    isPending: isFetchPending,
    refetch: refetchTemplateFooters
  } = useQuery({
    queryKey: [
      'templateFooters',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.core.templateFooter.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm
      })
  });

  const templateFooters = React.useMemo(() => {
    return templateFootersResp?.data || [];
  }, [templateFootersResp]);

  const { mutate: removeTemplateFooter, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: string) => api.core.templateFooter.remove(id),
    onSuccess: () => {
      if (templateFooters?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContentManagement('templateFooter.action_remove_success'));
      refetchTemplateFooters();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('content-management', error, 'templateFooter.action_remove_failure')
      );
    }
  });

  const { deleteTemplateFooterDialog, openDeleteTemplateFooterDialog } =
    useTemplateFooterDeleteDialog({
      representation: templateFooterStore?.response?.name,
      deleteTemplateFooter: () => removeTemplateFooter(templateFooterStore?.response?.id),
      isDeletionPending: isDeletePending,
      reset: templateFooterStore.reset
    });

  const context: DataTableConfig<ResponseTemplateFooterDto> = {
    singularName: 'Footer',
    pluralName: 'Footers',
    createCallback: () => {
      router.push('/content-management/pdf/footers/new');
    },
    updateCallback: (target: ResponseTemplateFooterDto) => {
      router.push(`/content-management/pdf/footers/${target.id}`);
    },
    deleteCallback: () => {
      openDeleteTemplateFooterDialog();
    },
    additionalActions: {},
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: templateFootersResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    ...tableReset,
    targetEntity: (entity) => {
      templateFooterStore.set('response', entity);
      templateFooterStore.set('updateDto', {
        name: entity.name,
        description: entity.description,
        ejsCode: entity.ejsCode,
        previewPictureId: entity.previewPictureId
      });
    }
  };

  const columns = useTemplateFooterColumns(context);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      {viewMode === 'table' ? (
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={templateFooters}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <CardView
            data={templateFooters}
            renderCard={(item) => (
              <TemplateFooterCard
                key={item.id}
                item={item}
                onClick={() => context.updateCallback?.(item)}
              />
            )}
          />
        </div>
      )}
      {deleteTemplateFooterDialog}
    </div>
  );
};
