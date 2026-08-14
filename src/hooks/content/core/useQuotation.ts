import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useQuotationProps {
  id?: number;
  enabled?: boolean;
  join?: string[];
}

export const useQuotation = (
  { id, enabled = true, join }: useQuotationProps = {
    id: undefined,
    enabled: true,
    join: []
  }
) => {
  const {
    data: quotationResp,
    isPending: isFetchQuotationPending,
    refetch: refetchQuotation
  } = useQuery({
    queryKey: ['quotation', id, join],
    queryFn: () => api.invoicing.quotation.findById(id!, join?.join(',')),
    enabled: enabled && !!id
  });

  const quotation = React.useMemo(() => {
    if (!quotationResp) return null;
    return quotationResp;
  }, [quotationResp]);

  return {
    quotation,
    isFetchQuotationPending,
    refetchQuotation
  };
};
