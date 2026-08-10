import { TemplateHeaderPortal } from '@/components/content-management/templates/headers/TemplateHeaderPortal';
import { PdfSettingsLayout } from '@/components/content-management/templates/main/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <TemplateHeaderPortal />
    </PdfSettingsLayout>
  );
}
