import React from 'react';
import { cn } from '@/lib/utils';
import { Info, Hourglass, File, FileText, Wallet, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SidebarNav from '@/components/shared/sidebar-nav';
import { Spinner } from '@/components/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useRouter } from 'next/router';

interface EnterpriseDetailsProps {
  className?: string;
  children?: React.ReactNode;
  enterpriseId: number;
}

export const EnterpriseDetails = ({
  className,
  enterpriseId,
  children
}: EnterpriseDetailsProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const { data: enterprise, isPending: isEnterprisePending } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => api.core.enterprise.findById(enterpriseId),
    enabled: !!enterpriseId
  });

  React.useEffect(() => {
    if (enterprise) {
      setIntro?.(
        enterprise.name,
        tContacts('enterprise.detailmenu.description', { enterpriseName: enterprise.name })
      );
    }
    setRoutes?.([
      { title: tCommon('menu.contacts.title'), href: '/contacts' },
      { title: tCommon('menu.contacts.subs.enterprises'), href: '/contacts/enterprises' },
      { title: `${enterprise?.name}` }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [enterprise, router.locale]);

  const sidebarNavItems = React.useMemo(() => {
    const items = [
      {
        title: tContacts('enterprise.detailmenu.overview'),
        icon: <Info size={18} />,
        href: `/contacts/enterprise/${enterpriseId}`
      },
      {
        title: tContacts('enterprise.detailmenu.interlocutors'),
        icon: <Users size={18} />,
        href: `/contacts/enterprise/${enterpriseId}/interlocutors`
      },
      {
        title: tContacts('enterprise.detailmenu.quotations'),
        icon: <File size={18} />,
        href: `/contacts/enterprise/${enterpriseId}/quotations`
      },
      {
        title: tContacts('enterprise.detailmenu.invoices'),
        icon: <FileText size={18} />,
        href: `/contacts/enterprise/${enterpriseId}/invoices`
      },
      {
        title: tContacts('enterprise.detailmenu.payments'),
        icon: <Wallet size={18} />,
        href: `/contacts/enterprise/${enterpriseId}/payments`
      },
      {
        title: tContacts('enterprise.detailmenu.chronological'),
        icon: <Hourglass size={18} />,
        href: `/contacts/enterprise/${enterpriseId}/chronological`
      }
    ];

    if (enterprise?.system) {
      return items.filter((item) => !item.href.endsWith('/interlocutors'));
    }

    return items;
  }, [enterprise?.system, enterpriseId, tContacts]);

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-7 overflow-hidden">
          {!isEnterprisePending ? (
            children
          ) : (
            <Spinner className="h-screen" show={isEnterprisePending} />
          )}
        </div>
      </div>
    </div>
  );
};
