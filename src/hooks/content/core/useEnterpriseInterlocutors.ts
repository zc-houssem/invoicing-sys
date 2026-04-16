import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useEnterpriseInterlocutorsProps {
  enterpriseId?: number;
  enabled?: boolean;
}

export const useEnterpriseInterlocutors = (
  { enterpriseId, enabled = true }: useEnterpriseInterlocutorsProps = { enabled: true }
) => {
  const {
    isFetching: isFetchInterlocutorsPending,
    data: interlocutorsResp,
    refetch: refetchInterlocutors
  } = useQuery({
    queryKey: ['enterprise-interlocutors', enterpriseId],
    queryFn: () => api.core.interlocutor.findByEnterprise(enterpriseId as number),
    enabled
  });

  const interlocutors = React.useMemo(() => {
    if (!interlocutorsResp) return [];
    return interlocutorsResp;
  }, [interlocutorsResp]);

  return {
    interlocutors,
    isFetchInterlocutorsPending,
    refetchInterlocutors
  };
};
