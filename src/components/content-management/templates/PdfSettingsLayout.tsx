import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SidebarNav from '@/components/shared/sidebar-nav';
import { Type, LayoutTemplate } from 'lucide-react';

interface PdfSettingsLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const PdfSettingsLayout: React.FC<PdfSettingsLayoutProps> = ({ className, children }) => {
  const router = useRouter();
  const { t } = useTranslation('content-management');

  const sidebarNavItems = [
    {
      title: t('pdf.menu.templates', { defaultValue: 'Templates' }),
      icon: <LayoutTemplate size={18} />,
      href: '/content-management/pdf/templates'
    },
    {
      title: t('pdf.menu.headers', { defaultValue: 'Headers' }),
      icon: <Type size={18} />,
      href: '/content-management/pdf/headers'
    },
    {
      title: t('pdf.menu.footers', { defaultValue: 'Footers' }),
      icon: <Type size={18} />,
      href: '/content-management/pdf/footers'
    }
  ];

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <div className="flex flex-col flex-1 lg:flex-row gap-4 overflow-hidden">
        <aside className="lg:flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-7 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
