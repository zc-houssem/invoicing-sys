import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useEnterprisesProps {
  enabled?: boolean;
  join?: string[];
  excludeSystem?: boolean;
}

export const useEnterprises = (
  { enabled, join = [], excludeSystem = false }: useEnterprisesProps = {
    enabled: true,
    join: [],
    excludeSystem: false
  }
) => {
  const {
    data: enterpriseResp,
    isPending: isEnterprisesPending,
    refetch: refetchEnterprises
  } = useQuery({
    queryKey: ['enterprises', join.join(','), excludeSystem],
    queryFn: async () =>
      api.core.enterprise.findAll({
        join: join.join(','),
        filter: excludeSystem ? 'system||$eq||false' : undefined
      }),
    enabled
  });

  const enterprises = React.useMemo(() => {
    if (!enterpriseResp) return [];
    return enterpriseResp;
  }, [enterpriseResp]);

  return {
    enterprises,
    isEnterprisesPending,
    refetchEnterprises
  };
};
