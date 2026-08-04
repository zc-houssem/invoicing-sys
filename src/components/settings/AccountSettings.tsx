import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SidebarNav from '../sidebar-nav';
import { User } from 'lucide-react';
import { useIntro } from '@/context/IntroContext';
import { useUI } from '@/context/UIContext';

interface AccountSettingsProps {
  className?: string;
  children?: React.ReactNode;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ className, children }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setIntro?.(tCommon('settings.account.my_profile'), tSettings('account.description'));
    setEnableMainOverflow?.(true);
    return () => {
      clearIntro?.();
      clearEnableMainOverflow?.();
    };
  }, [router.locale, setIntro, clearIntro, setEnableMainOverflow, clearEnableMainOverflow, tCommon, tSettings]);

  const sidebarNavItems = [
    {
      title: tCommon('settings.account.my_profile'),
      icon: <User size={18} />,
      href: '/settings/account/profile'
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
