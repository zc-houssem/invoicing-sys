import { useRouter } from 'next/router';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';
import { InvoicePortal } from '@/components/invoicing/invoice/InvoicePortal';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <InterlocutorDetails interlocutorId={Number(id)}>
      <InvoicePortal interlocutorId={Number(id)} />
    </InterlocutorDetails>
  );
}
