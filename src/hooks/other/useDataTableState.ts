import React from 'react';

const isClient = typeof window !== 'undefined';

interface DefaultSortDetails {
  order: boolean;
  sortKey: string;
}

export function useDataTableState(
  id: string,
  defaultSortDetails: DefaultSortDetails = { order: true, sortKey: 'id' },
  defaultSize = 10,
  defaultColumnFilters: Record<string, string> = {}
) {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [size, setSize] = React.useState<number>(() => {
    if (!isClient) return defaultSize;
    const saved = localStorage.getItem(`datatable-${id}-size`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultSize;
      }
    }
    return defaultSize;
  });

  const [sortDetails, setSortDetails] = React.useState<DefaultSortDetails>(() => {
    if (!isClient) return defaultSortDetails;
    const saved = localStorage.getItem(`datatable-${id}-sort`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultSortDetails;
      }
    }
    return defaultSortDetails;
  });

  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>(() => {
    if (!isClient) return defaultColumnFilters;
    const saved = localStorage.getItem(`datatable-${id}-filters`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultColumnFilters;
      }
    }
    return defaultColumnFilters;
  });

  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    if (!isClient) return {};
    const saved = localStorage.getItem(`datatable-${id}-visibility`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  React.useEffect(() => {
    localStorage.setItem(`datatable-${id}-size`, JSON.stringify(size));
  }, [id, size]);

  React.useEffect(() => {
    localStorage.setItem(`datatable-${id}-sort`, JSON.stringify(sortDetails));
  }, [id, sortDetails]);

  React.useEffect(() => {
    localStorage.setItem(`datatable-${id}-filters`, JSON.stringify(columnFilters));
  }, [id, columnFilters]);

  React.useEffect(() => {
    localStorage.setItem(`datatable-${id}-visibility`, JSON.stringify(columnVisibility));
  }, [id, columnVisibility]);

  return {
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
    columnVisibility,
    setColumnVisibility
  };
}
