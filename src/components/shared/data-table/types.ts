interface DataTableRowAdditionalAction<T> {
  actionCallback?: (entity: T) => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isActionVisible?: (entity: T) => boolean;
}

export interface DataTableExportConfig<T> {
  enabled: boolean;
  filename: string;
  fetchAll?: () => Promise<T[]>;
}

export interface DataTableColumnFilterOption {
  label: string;
  filter: string;
}

export type DataTableColumnFilterType = 'options' | 'string' | 'select' | 'date-range';

export interface DataTableColumnMeta<T> {
  exportLabel?: string;
  exportKey?: string;
  exportValue?: (row: T) => unknown;
  skipExport?: boolean;
  filterKey?: string;
  filterField?: string;
  filterType?: DataTableColumnFilterType;
  filterOptions?: DataTableColumnFilterOption[];
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta<TData> {}
}

export interface DataTableConfig<T> {
  singularName: string;
  pluralName: string;
  //pagination
  page: number;
  size: number;
  totalPageCount: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  //sorting
  order?: boolean;
  sortKey?: string;
  setSortDetails?: (order: boolean, sortKey: string) => void;
  //filtering
  searchTerm?: string;
  setSearchTerm?: (searchTerm: string) => void;
  columnFilters?: Record<string, string>;
  setColumnFilter?: (filterKey: string, filterParam: string | null) => void;
  clearFiltersAndSort?: () => void;
  hasActiveFiltersOrSort?: boolean;
  //actions
  createCallback?: () => void;
  inspectCallback?: (entity: T) => void;
  updateCallback?: (entity: T) => void;
  deleteCallback?: (entity: T) => void;
  additionalActions?: Record<number, DataTableRowAdditionalAction<T>[]>;
  //utility
  targetEntity?: (entity: T) => void;
  invisibleColumns?: string[];
  columnVisibility?: Record<string, boolean>;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  exportConfig?: DataTableExportConfig<T>;
}

export enum DataTableCellVariant {
  AVATAR = 'avatar',
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DATE_TIME = 'date-time',
  CURRENCY = 'currency',
  EMAIL = 'email',
  PHONE = 'phone'
}
