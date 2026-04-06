import React from 'react';
import { cn } from '@/lib/utils';
import { Info, File, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import SidebarNav from '@/components/sidebar-nav';
import useInterlocutor from '@/hooks/content/useInterlocutor';
import { Spinner } from '@/components/shared';

interface InterlocutorDetailsProps {
  className?: string;
  interlocutorId: string;
  children?: React.ReactNode;
}

export const InterlocutorDetails: React.FC<InterlocutorDetailsProps> = ({
  className,
  interlocutorId,
  children
}) => {
  const { t: tContacts } = useTranslation('contacts');

  const { interlocutor, isFetchInterlocutorPending } = useInterlocutor(parseInt(interlocutorId));

  const fullName = `${interlocutor?.name || ''} ${interlocutor?.surname || ''}`.trim();

  const sidebarNavItems = [
    {
      title: tContacts('interlocutor.detailmenu.overview'),
      icon: <Info size={18} />,
      href: `/contacts/interlocutor/${interlocutorId}/overview`
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
    <div className={cn('flex flex-col flex-1 overflow-hidden m-5 lg:mx-10', className)}>
      <div className="space-y-0.5 py-5 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {tContacts('interlocutor.detailmenu.title', { interlocutorName: fullName })}
        </h1>
        <p className="text-muted-foreground">
          {tContacts('interlocutor.detailmenu.description', { interlocutorName: fullName })}
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 ">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-[7] overflow-hidden">
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
