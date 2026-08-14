import { useRouter } from 'next/router';
import { UserDetails } from '@/components/administrative-tools/users/UserDetails';
import { QuotationPortal } from '@/components/invoicing/quotation/QuotationPortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <UserDetails userId={id}>
      <QuotationPortal createdById={id} />
    </UserDetails>
  );
}
