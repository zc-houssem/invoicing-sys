import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface UseEnterpriseMembersProps {
  enterpriseId?: number;
  enabled?: boolean;
}

export const useEnterpriseMembers = ({
  enterpriseId,
  enabled = true
}: UseEnterpriseMembersProps = {}) => {
  const {
    isFetching: isFetchMembersPending,
    data: membersResp,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ['enterprise-members', enterpriseId],
    queryFn: () => api.core.enterpriseMember.findByEnterprise(enterpriseId as number),
    enabled: enabled && !!enterpriseId
  });

  const members = React.useMemo(() => membersResp || [], [membersResp]);

  return {
    members,
    isFetchMembersPending,
    refetchMembers
  };
};
