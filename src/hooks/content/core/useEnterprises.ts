import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useEnterprisesProps {
  enabled?: boolean;
}

export const useEnterprises = ({ enabled }: useEnterprisesProps = { enabled: true }) => {
  const {
    data: enterpriseResp,
    isPending: isEnterprisesPending,
    refetch: refetchEnterprises
  } = useQuery({
    queryKey: ['enterprises'],
    queryFn: async () => api.enterprise.findAll(),
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
