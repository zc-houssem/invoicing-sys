import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { ResponseQuotationDto, UpdateQuotationDto } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { dir } from 'console';
import { useRouter } from 'next/router';
import React from 'react';
import { useSellingQuotationColumns } from './columns';

interface QuotationPortalProps {
  className?: string;
}

export const QuotationPortal = ({ className }: QuotationPortalProps) => {
  const router = useRouter();

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      'Selling Quotations',
      'Here you can manage your selling quotations, which will be used for sales and invoicing.'
    );
    setRoutes?.([{ title: 'Selling' }, { title: 'Quotation' }]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const quotationStore = useQuotationStore();

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

  const {
    data: sellingQuotationsResp,
    isPending: isFetchPending,
    refetch: refetchSellingQuotations,
    error
  } = useQuery({
    queryKey: [
      'selling-quotations',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.invoicing.quotation.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm
      })
  });

  const sellingQuotations = React.useMemo(() => {
    return sellingQuotationsResp?.data || [];
  }, [sellingQuotationsResp]);

  const context: DataTableConfig<ResponseQuotationDto> = {
    singularName: 'Quotation',
    pluralName: 'Quotations',
    //dialogs
    createCallback: () => {
      router.push('/selling/_quotations/new');
    },
    updateCallback: () => {},
    deleteCallback: () => {},
    additionalActions: {},
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: sellingQuotationsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (entity) => {
      quotationStore.set('response', entity);
      quotationStore.set('updateDto', {
        direction: entity.direction,
        date: entity.date ? new Date(entity.date) : null,
        dueDate: entity.dueDate ? new Date(entity.dueDate) : null,
        object: entity.object,
        generalConditions: entity.generalConditions
      } satisfies UpdateQuotationDto);
    }
  };

  const columns = useSellingQuotationColumns(context);

  const isPending = isFetchPending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={sellingQuotations}
        columns={columns}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};
