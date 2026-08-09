import { TemplatePortal } from '@/components/content-management/templates/TemplatePortal';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <TemplatePortal />
    </PdfSettingsLayout>
  );
}
