import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

interface useInterlocutorsProp {
  enabled?: boolean;
}

export const useInterlocutors = ({ enabled = true }: useInterlocutorsProp = {}) => {
  const {
    data,
    isPending: isInterlocutorsPending,
    refetch: refetchInterlocutors
  } = useQuery({
    queryKey: ['interlocutors'],
    queryFn: () => api.core.interlocutor.findAll({}),
    enabled
  });

  const interlocutors = React.useMemo(() => {
    return data || [];
  }, [data]);

  return { interlocutors, isInterlocutorsPending, refetchInterlocutors };
};
