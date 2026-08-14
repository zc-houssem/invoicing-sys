import { useRouter } from 'next/router';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';
import { QuotationPortal } from '@/components/invoicing/quotation/QuotationPortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <InterlocutorDetails interlocutorId={Number(id)}>
      <QuotationPortal interlocutorId={Number(id)} />
    </InterlocutorDetails>
  );
}
