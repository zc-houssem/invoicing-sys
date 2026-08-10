import { CreateTemplateFooterForm } from '@/components/content-management/templates/footers/forms/CreateTemplateFooterForm';
import { PdfSettingsLayout } from '@/components/content-management/templates/main/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateFooterForm />
    </PdfSettingsLayout>
  );
}
