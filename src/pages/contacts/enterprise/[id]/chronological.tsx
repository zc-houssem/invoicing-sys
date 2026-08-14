import React from 'react';
import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { ChronologicalTimeline } from '@/components/contacts/enterprise/details/ChronologicalTimeline';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <ChronologicalTimeline />
    </EnterpriseDetails>
  );
}
