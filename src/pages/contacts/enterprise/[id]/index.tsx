import React from 'react';
import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { EnterpriseOverview } from '@/components/contacts/enterprise/details/EnterpriseOverview';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <EnterpriseOverview id={Number(id)} />
    </EnterpriseDetails>
  );
}
