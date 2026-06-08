import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { ComingSoon } from '@/components/shared';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <ComingSoon />
    </EnterpriseDetails>
  );
}
