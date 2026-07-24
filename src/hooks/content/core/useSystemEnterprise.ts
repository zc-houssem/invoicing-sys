import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface useSystemEnterprisesProps {
  enabled?: boolean;
}

export const useSystemEnterprises = (
  { enabled = true }: useSystemEnterprisesProps = { enabled: true }
) => {
  const {
    data,
    isPending: isSystemEnterprisesPending,
    refetch: refetchSystemEnterprises
  } = useQuery({
    queryKey: ['system-enterprises'],
    queryFn: () => api.core.enterprise.findAllSystemEnterprises(),
    enabled
  });

  const systemEnterprises = React.useMemo(() => {
    return data || [];
  }, [data]);

  return {
    systemEnterprises,
    isSystemEnterprisesPending,
    refetchSystemEnterprises
  };
};
