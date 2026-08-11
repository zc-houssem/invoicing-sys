import { CreateTemplateForm } from '@/components/content-management/templates/main/forms/CreateTemplateForm';
import { PdfSettingsLayout } from '@/components/content-management/templates/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateForm />
    </PdfSettingsLayout>
  );
}
