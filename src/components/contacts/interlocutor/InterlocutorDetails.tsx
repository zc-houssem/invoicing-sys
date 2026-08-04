import React from 'react';
import { cn } from '@/lib/utils';
import { Info, File, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SidebarNav from '@/components/sidebar-nav';
import { useInterlocutor } from '@/hooks/content/core/useInterlocutor';
import { Spinner } from '@/components/shared';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useRouter } from 'next/router';

interface InterlocutorDetailsProps {
  className?: string;
  interlocutorId: number;
  children?: React.ReactNode;
}

export const InterlocutorDetails = ({
  className,
  interlocutorId,
  children
}: InterlocutorDetailsProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const { interlocutor, isFetchInterlocutorPending } = useInterlocutor({ id: interlocutorId });

  const fullName = `${interlocutor?.firstName || ''} ${interlocutor?.lastName || ''}`.trim();

  React.useEffect(() => {
    if (interlocutor) {
      setIntro?.(
        tContacts('interlocutor.detailmenu.title', { interlocutorName: fullName }),
        tContacts('interlocutor.detailmenu.description', { interlocutorName: fullName })
      );
    }
    setRoutes?.([
      { title: tCommon('menu.contacts.title'), href: '/contacts' },
      { title: tCommon('menu.contacts.subs.interlocutors'), href: '/contacts/interlocutors' },
      { title: fullName }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [interlocutor, router.locale]);

  const sidebarNavItems = [
    {
      title: tContacts('interlocutor.detailmenu.overview'),
      icon: <Info size={18} />,
      href: `/contacts/interlocutor/${interlocutorId}`
    },
    {
      title: tContacts('interlocutor.detailmenu.quotations'),
      icon: <File size={18} />,
      href: `/contacts/interlocutor/${interlocutorId}/quotations`
    },
    {
      title: tContacts('interlocutor.detailmenu.invoices'),
      icon: <FileText size={18} />,
      href: `/contacts/interlocutor/${interlocutorId}/invoices`
    }
  ];

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 ">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-7 overflow-hidden">
          {!isFetchInterlocutorPending ? (
            children
          ) : (
            <Spinner className="h-screen" show={isFetchInterlocutorPending} />
          )}
        </div>
      </div>
    </div>
  );
};
