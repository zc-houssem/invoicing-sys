import { UpdateTemplateForm } from '@/components/content-management/templates/forms/UpdateTemplateForm';
import { useRouter } from 'next/router';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <PdfSettingsLayout>
      <UpdateTemplateForm id={id} />
    </PdfSettingsLayout>
  );
}
