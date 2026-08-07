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
import { Printer } from 'lucide-react';
import { useDataTableState } from '@/hooks/other/useDataTableState';

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

    const {
    page, setPage,
    size, setSize,
    sortDetails, setSortDetails,
    searchTerm, setSearchTerm,
    columnFilters, setColumnFilters
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

  // print template preview
  const handlePrintTemplate = React.useCallback(async (template: ResponseTemplateDto) => {
    try {
      if (!template.documentId) {
        toast.error('No document attached to this template');
        return;
      }

      toast.info('Generating PDF preview...');

      const { generate } = await import('@pdfme/generator');
      const { text, image, date, table, multiVariableText } = await import('@pdfme/schemas');
      const { loadFonts } = await import('./pdfme/loadFonts');

      const fonts = await loadFonts();

      // Fetch the base PDF file from storage
      const file = await api.core.storage.getFileById(template.documentId);
      const basePdf = await file.arrayBuffer();

      // Build the pdfme template from stored variables
      const pdfTemplate = template.variables
        ? {
            basePdf,
            ...(template.variables as object)
          }
        : {
            basePdf,
            schemas: [[]]
          };

      // Generate placeholder inputs from the template schemas
      const schemas = (pdfTemplate as any).schemas || [[]];
      const inputs = schemas.map((pageSchemas: any[]) => {
        const pageInput: Record<string, string> = {};
        if (Array.isArray(pageSchemas)) {
          pageSchemas.forEach((field: any) => {
            if (field.name) {
              pageInput[field.name] = field.content || field.name;
            }
          });
        }
        return pageInput;
      });

      const pdf = await generate({
        template: pdfTemplate as any,
        inputs: [{}],
        plugins: { text, image, date, table, multiVariableText },
        options: { font: fonts }
      });

      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 30000);

      toast.success('PDF preview generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF preview');
    }
  }, []);

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
    additionalActions: {
      0: [
        {
          actionLabel: tCommon('commands.print') || 'Print',
          actionIcon: <Printer className="size-4" />,
          actionCallback: (entity: ResponseTemplateDto) => {
            handlePrintTemplate(entity);
          },
          isActionVisible: (entity: ResponseTemplateDto) => !!entity.documentId
        }
      ]
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
        variables: JSON.stringify(entity.variables)
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
