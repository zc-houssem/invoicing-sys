import { CreateTemplateFooterForm } from '@/components/content-management/templates/footers/forms/CreateTemplateFooterForm';
import { PdfSettingsLayout } from '@/components/content-management/templates/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateFooterForm />
    </PdfSettingsLayout>
  );
}
