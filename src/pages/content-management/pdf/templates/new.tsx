import { CreateTemplateForm } from '@/components/content-management/templates/forms/CreateTemplateForm';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateForm  />
    </PdfSettingsLayout>
  );
}
