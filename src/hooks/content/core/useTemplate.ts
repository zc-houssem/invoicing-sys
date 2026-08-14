import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useTemplateProps {
  id?: string;
  enabled?: boolean;
  join?: string[];
}

export const useTemplate = (
  { id, enabled = true, join }: useTemplateProps = {
    id: undefined,
    enabled: true,
    join: []
  }
) => {
  const {
    data: templateResp,
    isPending: isTemplatePending,
    refetch: refetchTemplate
  } = useQuery({
    queryKey: ['template', id, join],
    queryFn: () => api.core.template.findById(id!, join?.join(',')),
    enabled: enabled && !!id
  });

  const template = React.useMemo(() => {
    if (!templateResp) return null;
    return templateResp;
  }, [templateResp]);

  return {
    template,
    isTemplatePending,
    refetchTemplate
  };
};
