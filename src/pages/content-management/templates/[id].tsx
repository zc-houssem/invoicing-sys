import { UpdateTemplateForm } from '@/components/content-management/templates/forms/UpdateTemplateForm';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return <UpdateTemplateForm id={id} />;
}
