import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useInvoiceWorkflowProps {
  id?: number;
  enabled?: boolean;
  join?: string[];
}

export const useInvoiceWorkflow = (
  { id, enabled = true, join }: useInvoiceWorkflowProps = {
    id: undefined,
    enabled: true,
    join: []
  }
) => {
  const {
    data: invoiceResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow
  } = useQuery({
    queryKey: ['invoice', id, join],
    queryFn: () => api.invoicing.invoice.workflow.findById(id!, join?.join(',')),
    enabled: enabled && !!id
  });

  const workflow = React.useMemo(() => {
    if (!invoiceResp) return null;
    return invoiceResp;
  }, [invoiceResp]);

  return {
    workflow,
    isWorkflowPending,
    refetchWorkflow
  };
};
