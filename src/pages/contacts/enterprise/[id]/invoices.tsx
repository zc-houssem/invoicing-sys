import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { InvoicePortal } from '@/components/invoicing/invoice/InvoicePortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <InvoicePortal />
    </EnterpriseDetails>
  );
}
