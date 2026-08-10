import { CreateTemplateHeaderForm } from '@/components/content-management/pdf/headers/forms/CreateTemplateHeaderForm';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateHeaderForm />
    </PdfSettingsLayout>
  );
}
