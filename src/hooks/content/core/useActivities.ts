import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useActivitiesProps {
  enabled?: boolean;
}

export const useActivities = ({ enabled = true }: useActivitiesProps = { enabled: true }) => {
  const {
    data: activitiesResp,
    isPending: isFetchActivitiesPending,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['activities'],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: 'refTypeId||$eq||activity'
      }),
    enabled
  });

  const activities = React.useMemo(() => {
    if (!activitiesResp) return [];
    return activitiesResp;
  }, [activitiesResp]);

  return {
    activities,
    isFetchActivitiesPending,
    refetchActivities
  };
};
