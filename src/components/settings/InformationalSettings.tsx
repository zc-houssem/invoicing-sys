import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SidebarNav from '../sidebar-nav';
import { Building, Landmark, User, MapPin, HashIcon, MessageCircle } from 'lucide-react';
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';

interface InformationalSettingsProps {
  className?: string;
  children?: React.ReactNode;
}

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  children
}) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setIntro?.(tSettings('account.singular'), tSettings('account.description'));
    setEnableMainOverflow?.(true);
    return () => {
      clearIntro?.();
      clearEnableMainOverflow?.();
    };
  }, [router.locale]);

  //menu items
  const sidebarNavItems = [
    {
      title: tCommon('settings.account.my_profile'),
      icon: <User size={18} />,
      href: '/settings/account/profile'
    },
    {
      title: tCommon('settings.account.my_enterprise'),
      icon: <Building size={18} />,
      href: '/settings/account/my-enterprise'
    },
    {
      title: tCommon('settings.account.bank_accounts'),
      icon: <Landmark size={18} />,
      href: '/settings/account/banks'
    },
    {
      title: tCommon('menu.contacts.subs.addresses'),
      icon: <MapPin size={18} />,
      href: '/settings/account/my-addresses'
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
        <div className="flex flex-col flex-7">{children}</div>
      </div>
    </div>
  );
};
