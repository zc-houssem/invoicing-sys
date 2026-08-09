import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SidebarNav from '../sidebar-nav';
import { Building, Landmark, MapPin, HashIcon, MessageCircle, Users } from 'lucide-react';
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

interface EnterpriseSettingsProps {
  className?: string;
  children?: React.ReactNode;
}

interface EnterprisePageMeta {
  title: string;
  description: string;
  breadcrumbTitle: string;
}

export const EnterpriseSettings: React.FC<EnterpriseSettingsProps> = ({ className, children }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const getPageMeta = React.useCallback((): EnterprisePageMeta => {
    switch (router.pathname) {
      case '/settings/account/my-enterprise':
        return {
          title: tCommon('settings.account.my_enterprise'),
          description: tSettings('enterprise.my_enterprise.description'),
          breadcrumbTitle: tCommon('settings.account.my_enterprise')
        };
      case '/settings/account/my-addresses':
        return {
          title: tCommon('menu.contacts.subs.addresses'),
          description: tSettings('enterprise.my_addresses.description'),
          breadcrumbTitle: tCommon('menu.contacts.subs.addresses')
        };
      case '/settings/account/members':
        return {
          title: tCommon('settings.account.members'),
          description: tSettings('members.page.description'),
          breadcrumbTitle: tCommon('settings.account.members')
        };
      case '/settings/account/banks':
        return {
          title: tCommon('settings.account.bank_accounts'),
          description: tSettings('enterprise.banks.description'),
          breadcrumbTitle: tCommon('settings.account.bank_accounts')
        };
      case '/settings/account/sequence':
        return {
          title: tCommon('settings.system.sequence'),
          description: tSettings('sequence.card_description'),
          breadcrumbTitle: tCommon('settings.system.sequence')
        };
      case '/settings/account/conditions':
        return {
          title: tCommon('settings.system.default_condition'),
          description: tSettings('default_condition.page_description'),
          breadcrumbTitle: tCommon('settings.system.default_condition')
        };
      default:
        return {
          title: tCommon('menu.enterprise.title'),
          description: '',
          breadcrumbTitle: tCommon('menu.enterprise.title')
        };
    }
  }, [router.pathname, tCommon, tSettings]);

  React.useEffect(() => {
    const meta = getPageMeta();

    setIntro?.(meta.title, meta.description);
    setRoutes?.([
      { title: tCommon('menu.settings.title') },
      {
        title: tCommon('menu.enterprise.title'),
        href: '/settings/account/my-enterprise'
      },
      { title: meta.breadcrumbTitle }
    ]);
    setEnableMainOverflow?.(true);

    return () => {
      clearIntro?.();
      clearRoutes?.();
      clearEnableMainOverflow?.();
    };
  }, [
    router.pathname,
    router.locale,
    getPageMeta,
    setIntro,
    clearIntro,
    setRoutes,
    clearRoutes,
    setEnableMainOverflow,
    clearEnableMainOverflow,
    tCommon
  ]);

  const sidebarNavItems = [
    {
      title: tCommon('settings.account.my_enterprise'),
      icon: <Building size={18} />,
      href: '/settings/account/my-enterprise'
    },
    {
      title: tCommon('menu.contacts.subs.addresses'),
      icon: <MapPin size={18} />,
      href: '/settings/account/my-addresses'
    },
    {
      title: tCommon('settings.account.members'),
      icon: <Users size={18} />,
      href: '/settings/account/members'
    },
    {
      title: tCommon('settings.account.bank_accounts'),
      icon: <Landmark size={18} />,
      href: '/settings/account/banks'
    },
    {
      title: tCommon('settings.system.sequence'),
      icon: <HashIcon size={18} />,
      href: '/settings/account/sequence'
    },
    {
      title: tCommon('settings.system.default_condition'),
      icon: <MessageCircle size={18} />,
      href: '/settings/account/conditions'
    }
  ];

  return (
    <div className={cn('flex flex-col flex-1', className)}>
      <div className="flex flex-col flex-1 lg:flex-row gap-4">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-7 min-w-0">{children}</div>
      </div>
    </div>
  );
};
