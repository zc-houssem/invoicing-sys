import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { InterlocutorPortal } from '@/components/contacts/interlocutor/InterlocutorPortal';
import { Spinner } from '@/components/shared';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  const enterpriseId = Number(id);

  const { data: enterprise, isPending } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => api.core.enterprise.findById(enterpriseId),
    enabled: !!enterpriseId
  });

  React.useEffect(() => {
    if (enterprise?.system) {
      router.replace(`/contacts/enterprise/${enterpriseId}`);
    }
  }, [enterprise?.system, enterpriseId, router]);

  if (!id || isPending) {
    return <Spinner className="h-screen" show={true} />;
  }

  if (enterprise?.system) {
    return null;
  }

  return (
    <EnterpriseDetails enterpriseId={enterpriseId}>
      <InterlocutorPortal enterpriseId={enterpriseId} />
    </EnterpriseDetails>
  );
}
