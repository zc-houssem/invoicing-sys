import { useRouter } from 'next/router';
import { UserDetails } from '@/components/administrative-tools/users/UserDetails';
import { PaymentPortal } from '@/components/invoicing/payment/PaymentPortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <UserDetails userId={id}>
      <PaymentPortal createdById={id} />
    </UserDetails>
  );
}
