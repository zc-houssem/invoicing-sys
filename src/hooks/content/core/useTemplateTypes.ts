import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useTemplateTypesProps {
  enabled?: boolean;
}

export const useTemplateTypes = ({ enabled = true }: useTemplateTypesProps = { enabled: true }) => {
  const {
    data: templateTypeResp,
    isPending: isTemplateTypePending,
    refetch: refetchTemplateTypes
  } = useQuery({
    queryKey: ['template-types'],
    queryFn: async () => {
      return api.core.templateType.findAll({});
    },
    enabled
  });

  const templateTypes = React.useMemo(() => {
    return templateTypeResp || [];
  }, [templateTypeResp]);

  return {
    templateTypes,
    isTemplateTypePending,
    refetchTemplateTypes
  };
};
