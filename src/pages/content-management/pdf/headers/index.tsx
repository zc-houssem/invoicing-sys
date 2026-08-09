import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useIntro } from '@/context/IntroContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';

export default function Page() {
  const { t: tContentManagement } = useTranslation('content-management');
  const { t: tCommon, i18n } = useTranslation('common');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const router = useRouter();

  React.useEffect(() => {
    setIntro?.(
      tContentManagement('pdf.headers.title', { defaultValue: 'Headers' }),
      tContentManagement('pdf.headers.coming_soon', { defaultValue: 'Header management coming soon.' })
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.headers', { defaultValue: 'Headers' }) }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale, i18n.language, tCommon, tContentManagement, setIntro, clearIntro, setRoutes, clearRoutes]);

  return (
    <PdfSettingsLayout>
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-border">
        <h1 className="text-2xl font-bold mb-4">{tContentManagement('pdf.headers.title', { defaultValue: 'Headers' })}</h1>
        <p className="text-muted-foreground">{tContentManagement('pdf.headers.coming_soon', { defaultValue: 'Header management coming soon.' })}</p>
      </div>
    </PdfSettingsLayout>
  );
}
