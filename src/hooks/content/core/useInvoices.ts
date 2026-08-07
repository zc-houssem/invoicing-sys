import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useInvoicesProps {
  enterpriseId?: number;
  currencyId?: number;
  enabled?: boolean;
  join?: string[];
}

export const useInvoices = (
  { enabled = true, enterpriseId, currencyId, join = [] }: useInvoicesProps = {
    enabled: true,
    join: []
  }
) => {
  const filterParts = [
    enterpriseId ? `enterpriseId||$eq||${enterpriseId}` : '',
    currencyId ? `currencyId||$eq||${currencyId}` : ''
  ].filter(Boolean);

  const filter = filterParts.length > 0 ? filterParts.join(';') : undefined;

  const {
    data: invoicesResp,
    isPending: isInvoicesPending,
    refetch: refetchInvoices
  } = useQuery({
    queryKey: ['invoices', enterpriseId, currencyId, join.join(',')],
    queryFn: async () =>
      api.invoicing.invoice.findAll({
        join: join.join(','),
        filter
      }),
    enabled: enabled && (enterpriseId !== undefined || currencyId !== undefined)
  });

  const invoices = React.useMemo(() => {
    if (!invoicesResp) return [];
    return invoicesResp;
  }, [invoicesResp]);

  return {
    invoices,
    isInvoicesPending,
    refetchInvoices
  };
};
