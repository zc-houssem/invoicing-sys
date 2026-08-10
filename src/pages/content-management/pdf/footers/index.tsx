import { TemplateFooterPortal } from '@/components/content-management/templates/footers/TemplateFooterPortal';
import { PdfSettingsLayout } from '@/components/content-management/templates/main/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <TemplateFooterPortal />
    </PdfSettingsLayout>
  );
}
