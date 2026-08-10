import { CreateTemplateHeaderForm } from '@/components/content-management/templates/headers/forms/CreateTemplateHeaderForm';
import { PdfSettingsLayout } from '@/components/content-management/templates/main/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateHeaderForm />
    </PdfSettingsLayout>
  );
}
