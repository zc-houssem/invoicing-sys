import { useRouter } from 'next/router';
import { UserDetails } from '@/components/administrative-tools/users/UserDetails';
import { UserOverview } from '@/components/administrative-tools/users/details/UserOverview';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <UserDetails userId={id}>
      <UserOverview id={id} />
    </UserDetails>
  );
}
