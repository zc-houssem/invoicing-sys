import { UserUpdateForm } from '@/components/administrative-tools/users/forms/UserUpdateForm';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return null;
  return <UserUpdateForm userId={id} />;
}
