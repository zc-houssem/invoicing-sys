import { useRouter } from 'next/router';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';
import { InterlocutorOverview } from '@/components/contacts/interlocutor/details/InterlocutorOverview';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <InterlocutorDetails interlocutorId={Number(id)}>
      <InterlocutorOverview id={Number(id)} />
    </InterlocutorDetails>
  );
}
