import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export interface UseIdentifiedUserProps {
  id?: string;
  join?: string[];
  enabled?: boolean;
}

export const useIdentifiedUser = ({
  id,
  join = [],
  enabled = true
}: UseIdentifiedUserProps = { join: [], enabled: true }) => {
  const joinKey = join.join(',');

  const {
    isPending: isFetchUserPending,
    data: userResp,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user', id, joinKey],
    queryFn: () => api.admin.user.findById(id, joinKey || undefined),
    enabled: enabled && !!id
  });

  const user = React.useMemo(() => {
    if (!userResp) return null;
    return userResp;
  }, [userResp]);

  return {
    user,
    isFetchUserPending,
    refetchUser
  };
};
