import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { DataTableToolbar } from './data-table-toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PackageOpen } from 'lucide-react';
import { DataTablePagination } from './data-table-pagination';
import { Spinner } from '@/components/shared/Spinner';
import { cn } from '@/lib/utils';
import { DataTableConfig } from './types';
import { useTranslation } from 'react-i18next';
import { useFooter } from '@/context/FooterContext';

interface DataTableProps<TData, TValue> {
  className?: string;
  containerClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  context: DataTableConfig<TData>;
  footerPagination?: boolean;
  isPending: boolean;
}

export function DataTable<TData, TValue>({
  className,
  containerClassName,
  columns,
  data,
  context,
  footerPagination = true,
  isPending
}: DataTableProps<TData, TValue>) {
  //set pagination in footer
  const { setContent } = useFooter();
  const { t } = useTranslation('common');
  React.useEffect(() => {
    if (footerPagination)
      setContent?.(<DataTablePagination table={table} context={context} className="px-10" />);
    return () => {
      setContent?.(null);
    };
  }, [
    footerPagination,
    context.totalPageCount,
    context.size,
    context.page,
    context.hasActiveFiltersOrSort,
    context.clearFiltersAndSort
  ]);

  const [rowSelection, setRowSelection] = React.useState({});
  const initialDefaultVisibility = React.useMemo(
    () => Object.fromEntries(context?.invisibleColumns?.map((column) => [column, false]) || []),
    [context?.invisibleColumns]
  );
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>(
    initialDefaultVisibility
  );

  const columnVisibility = context?.columnVisibility
    ? { ...initialDefaultVisibility, ...context.columnVisibility }
    : internalColumnVisibility;

  const handleColumnVisibilityChange = React.useCallback(
    (updaterOrValue: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      if (context?.setColumnVisibility) {
        context.setColumnVisibility(updaterOrValue as any);
      } else {
        setInternalColumnVisibility(updaterOrValue);
      }
    },
    [context]
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: 100
      }
    },
    defaultColumn: {
      size: 0,
      minSize: 0
    },
    meta: {
      context
    }
  });
  return (
    <div className={cn(className, 'space-y-4')}>
      <DataTableToolbar table={table} data={data} context={context} />
      <div className={cn('rounded-lg border', containerClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length && !isPending ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-1 px-2 text-xs"
                      style={{ width: `${cell.column.getSize()}px` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {t('datatable.noResults')} <PackageOpen />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center ">
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {t('table.loading')} <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!footerPagination && <DataTablePagination table={table} context={context} />}
    </div>
  );
}
