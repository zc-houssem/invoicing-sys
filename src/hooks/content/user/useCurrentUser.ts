import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

export const useCurrentUser = () => {
  const { status } = useSession();

  const {
    data,
    isPending: isUserPending,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.currentUser.find(),
    enabled: status === 'authenticated'
  });

  const user = React.useMemo(() => (data ? data : null), [data]);

  return {
    user,
    isUserPending,
    refetchUser
  };
};
