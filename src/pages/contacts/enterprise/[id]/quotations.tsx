import { useRouter } from 'next/router';
import { EnterpriseDetails } from '@/components/contacts/enterprise/EnterpriseDetails';
import { QuotationPortal } from '@/components/invoicing/quotation/QuotationPortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <EnterpriseDetails enterpriseId={Number(id)}>
      <QuotationPortal enterpriseId={Number(id)} />
    </EnterpriseDetails>
  );
}
