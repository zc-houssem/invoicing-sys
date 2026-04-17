import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useEnterprisesProps {
  enabled?: boolean;
  join: string[];
}

export const useEnterprises = (
  { enabled, join }: useEnterprisesProps = { enabled: true, join: [] }
) => {
  const {
    data: enterpriseResp,
    isPending: isEnterprisesPending,
    refetch: refetchEnterprises
  } = useQuery({
    queryKey: ['enterprises'],
    queryFn: async () =>
      api.core.enterprise.findAll({
        join: join.join(',')
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
