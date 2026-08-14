import { useRouter } from 'next/router';
import { EnterpriseUpdateForm } from '@/components/contacts/enterprise/form/EnterpriseUpdateForm';
import { Page404 } from '@/components/shared';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return <EnterpriseUpdateForm enterpriseId={Number(id)} />;
}
