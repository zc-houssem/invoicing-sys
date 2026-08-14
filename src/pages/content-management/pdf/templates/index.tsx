import { TemplatePortal } from '@/components/content-management/templates/main/TemplatePortal';
import { PdfSettingsLayout } from '@/components/content-management/templates/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <TemplatePortal />
    </PdfSettingsLayout>
  );
}
