import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { InterlocutorPortal } from '@/components/contacts/interlocutor/InterlocutorPortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <InterlocutorPortal enterpriseId={Number(id)} />
    </EnterpriseDetails>
  );
}
