import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { ResponseLogDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useDataTableState } from '@/hooks/other/useDataTableState';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useLoggerColumns } from './useLoggerColumns';

interface LoggePortalProps {
  className?: string;
  userId?: string;
}

export const LoggerPortal = ({ className, userId }: LoggePortalProps) => {
  const { t, ready } = useTranslation('logs');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    if (!userId) {
      setRoutes?.([
        { title: `${t('logger.intro')}`, href: '/audit-monitoring' },
        {
          title: `${t('logger.introTitle')}`,
          href: '/audit-monitoring/logger'
        }
      ]);
      setIntro?.(`${t('logger.introTitle')}`, `${t('logger.introDescription')}`);
      return () => {
        clearRoutes?.();
        clearIntro?.();
      };
    }
  }, [t, ready]);

  const {
    page, setPage,
    size, setSize,
    sortDetails, setSortDetails,
    searchTerm, setSearchTerm,
    columnFilters, setColumnFilters
  } = useDataTableState('logger-table', { order: false, sortKey: 'createdAt' }, 10);

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: logsResponse,
    isPending: isLogsPending,
    refetch: refetchLogs
  } = useQuery({
    queryKey: [
      'logs',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.admin.logger.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        search: debouncedSearchTerm,
        filter: userId ? `userId||$eq||${userId}` : ''
      })
  });

  const logs = React.useMemo(() => {
    if (!logsResponse) return [];
    return logsResponse.data;
  }, [logsResponse]);

  const context: DataTableConfig<ResponseLogDto> = {
    singularName: t('logger.singularName'),
    pluralName: t('logger.pluralName'),
    page,
    size,
    totalPageCount: logsResponse?.meta.pageCount || 0,
    setPage,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    searchTerm,
    setSearchTerm
  };

  const columns = useLoggerColumns(context);

  const isPending = isLogsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        columns={columns}
        data={logs}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};
