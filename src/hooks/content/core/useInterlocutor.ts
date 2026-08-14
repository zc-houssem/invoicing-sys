import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface UseInterlocutorProps {
  id?: number;
  enabled?: boolean;
  join?: string[];
}

export const useInterlocutor = (
  { id, enabled = true, join = [] }: UseInterlocutorProps = {
    enabled: true,
    join: []
  }
) => {
  const {
    data: interlocutorResp,
    isPending: isFetchInterlocutorPending,
    refetch: refetchInterlocutor
  } = useQuery({
    queryKey: ['interlocutor', id],
    queryFn: () => api.core.interlocutor.findById(id!),
    enabled: enabled && !!id
  });

  const interlocutor = React.useMemo(() => {
    return interlocutorResp || null;
  }, [interlocutorResp]);

  return {
    interlocutor,
    isFetchInterlocutorPending,
    refetchInterlocutor
  };
};
