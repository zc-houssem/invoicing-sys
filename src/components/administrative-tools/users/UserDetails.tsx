import React from 'react';
import { cn } from '@/lib/utils';
import { Info, File, FileText, Wallet, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SidebarNav from '@/components/sidebar-nav';
import { Spinner } from '@/components/shared';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useRouter } from 'next/router';
import { useIdentifiedUser } from '@/hooks/content/user/useIdentifiedUser';
import { identifyUser } from '@/lib/user';

interface UserDetailsProps {
  className?: string;
  userId: string;
  children?: React.ReactNode;
}

export const UserDetails = ({ className, userId, children }: UserDetailsProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const { user, isFetchUserPending } = useIdentifiedUser({
    id: userId,
    join: ['role'],
    enabled: Boolean(userId)
  });

  const userName = identifyUser(user);

  React.useEffect(() => {
    if (user) {
      setIntro?.(
        tUser('userManagement.detailmenu.title', { userName }),
        tUser('userManagement.detailmenu.description', { userName })
      );
    }
    setRoutes?.([
      { title: tCommon('menu.administrativeTools.title') },
      {
        title: tUser('userManagement.page.users'),
        href: '/administrative-tools/user-management/users'
      },
      { title: userName }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [user, router.locale]);

  const sidebarNavItems = [
    {
      title: tUser('userManagement.detailmenu.overview'),
      icon: <Info size={18} />,
      href: `/administrative-tools/user-management/users/${userId}`
    },
    {
      title: tUser('userManagement.detailmenu.systemEnterprises'),
      icon: <Building2 size={18} />,
      href: `/administrative-tools/user-management/users/${userId}/system-enterprises`
    },
    {
      title: tUser('userManagement.detailmenu.quotations'),
      icon: <File size={18} />,
      href: `/administrative-tools/user-management/users/${userId}/quotations`
    },
    {
      title: tUser('userManagement.detailmenu.invoices'),
      icon: <FileText size={18} />,
      href: `/administrative-tools/user-management/users/${userId}/invoices`
    },
    {
      title: tUser('userManagement.detailmenu.payments'),
      icon: <Wallet size={18} />,
      href: `/administrative-tools/user-management/users/${userId}/payments`
    }
  ];

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-7 overflow-hidden">
          {!isFetchUserPending ? children : <Spinner className="h-screen" show={isFetchUserPending} />}
        </div>
      </div>
    </div>
  );
};
