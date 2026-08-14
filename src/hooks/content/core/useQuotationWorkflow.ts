import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useQuotationWorkflowProps {
  id?: number;
  enabled?: boolean;
  join?: string[];
}

export const useQuotationWorkflow = (
  { id, enabled = true, join }: useQuotationWorkflowProps = {
    id: undefined,
    enabled: true,
    join: []
  }
) => {
  const {
    data: quotationResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow
  } = useQuery({
    queryKey: ['quotation', id, join],
    queryFn: () => api.invoicing.quotation.workflow.findById(id!, join?.join(',')),
    enabled: enabled && !!id
  });

  const workflow = React.useMemo(() => {
    if (!quotationResp) return null;
    return quotationResp;
  }, [quotationResp]);

  return {
    workflow,
    isWorkflowPending,
    refetchWorkflow
  };
};
