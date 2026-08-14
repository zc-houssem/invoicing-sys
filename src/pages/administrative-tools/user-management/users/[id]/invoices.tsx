import { useRouter } from 'next/router';
import { UserDetails } from '@/components/administrative-tools/users/UserDetails';
import { InvoicePortal } from '@/components/invoicing/invoice/InvoicePortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <UserDetails userId={id}>
      <InvoicePortal createdById={id} />
    </UserDetails>
  );
}
