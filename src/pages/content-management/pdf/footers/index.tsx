import { TemplateFooterPortal } from '@/components/content-management/pdf/footers/TemplateFooterPortal';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';

export default function Page() {
  return (
    <PdfSettingsLayout>
      <TemplateFooterPortal />
    </PdfSettingsLayout>
  );
}
