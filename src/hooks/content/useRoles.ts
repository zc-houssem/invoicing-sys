import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useRolesProps {
  enabled?: boolean;
}

export const useRoles = ({ enabled = true }: useRolesProps = {}) => {
  const { isFetching: isFetchRolesPending, data: rolesResp } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.admin.role.findAll(),
    enabled
  });

  const roles = React.useMemo(() => {
    if (!rolesResp) return [];
    return rolesResp;
  }, [rolesResp]);

  return {
    roles,
    isFetchRolesPending
  };
};
