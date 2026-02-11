import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useCurrentUserProps {
  enabled?: boolean;
}

export const useCurrentUser = ({ enabled }: useCurrentUserProps = { enabled: true }) => {
  const {
    data: userResp,
    isFetching: isFetchUserPending,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.user.findCurrent(),
    enabled
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
