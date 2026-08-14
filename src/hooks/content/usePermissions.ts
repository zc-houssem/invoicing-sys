import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const usePermissions = (enabled: boolean = true) => {
  const { isFetching: isFetchPermissionsPending, data: permissionsResp } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => api.admin.permission.findAll(),
    enabled
  });

  const permissions = React.useMemo(() => {
    if (!permissionsResp) return [];
    return permissionsResp;
  }, [permissionsResp]);

  return {
    permissions,
    isFetchPermissionsPending
  };
};
