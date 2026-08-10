import { CreateTemplateFooterForm } from '@/components/content-management/pdf/footers/forms/CreateTemplateFooterForm';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <CreateTemplateFooterForm />
    </PdfSettingsLayout>
  );
}
