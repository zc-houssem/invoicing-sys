import * as React from 'react';
import {
  BookUser,
  Building,
  Building2,
  Cpu,
  File,
  FileText,
  Landmark,
  LayoutDashboard,
  Magnet,
  Package,
  Printer,
  Rows3Icon,
  Settings,
  Shield,
  ShoppingCart,
  Table,
  UserCog,
  Users,
  Wallet
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { useSystemEnterprises } from '@/hooks/content/core/useSystemEnterprise';
import { MainNav } from './MainNav';
import { TeamSwitcher } from './TeamSwitcher';
import { useTranslation } from 'react-i18next';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation('common');
  const { systemEnterprises } = useSystemEnterprises();

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg'
    },
    teams: systemEnterprises.map((enterprise) => ({
      id: enterprise.id,
      name: enterprise.name,
      logoId: enterprise.logoId,
      plan: enterprise.system ? t('company.system_company') : t('company.workspace')
    })),
    navMain: [
      {
        id: 1,
        title: t('menu.dashboard.title'),
        url: '#',
        icon: LayoutDashboard,
        items: []
      },
      {
        id: 2,
        title: t('menu.contacts.title'),
        url: '#',
        icon: Users,
        items: [
          {
            title: t('menu.contacts.subs.enterprises'),
            url: '/contacts/enterprises',
            icon: Building
          },
          {
            title: t('menu.contacts.subs.interlocutors'),
            url: '/contacts/interlocutors',
            icon: BookUser
          }
        ]
      },
      {
        id: 3,
        title: t('menu.selling.title'),
        url: '#',
        icon: Package,
        items: [
          {
            title: t('menu.selling.subs.quotation'),
            url: '/selling/quotations',
            icon: File
          },
          {
            title: t('menu.selling.subs.invoice'),
            url: '/selling/invoices',
            icon: FileText
          },
          {
            title: t('menu.selling.subs.payment'),
            url: '/selling/payments',
            icon: Wallet
          }
        ]
      },
      {
        id: 4,
        title: t('menu.buying.title'),
        url: '#',
        icon: ShoppingCart,
        items: [
          {
            title: t('menu.buying.subs.quotation'),
            url: '/buying/quotation',
            icon: File
          },
          {
            title: t('menu.buying.subs.invoice'),
            url: '/buying/invoices',
            icon: FileText
          },
          {
            title: t('menu.buying.subs.payment'),
            url: '/buying/payments',
            icon: Wallet
          },
          {
            title: t('menu.buying.subs.taxWithholding'),
            url: '/buying/withholding',
            icon: Magnet
          }
        ]
      },
      {
        id: 5,
        title: t('menu.contentManagement.title'),
        url: '/content-management',
        icon: Package,
        items: [
          {
            title: t('menu.contentManagement.subs.bankAccounts'),
            url: '/content-management/bank-accounts',
            icon: Landmark
          },
          {
            title: t('menu.contentManagement.subs.taxRates'),
            url: '/content-management/tax-rates',
            icon: Wallet
          },
          {
            title: t('menu.contentManagement.subs.refTypes'),
            url: '/content-management/reference-types',
            icon: Rows3Icon
          },
          {
            title: t('menu.contentManagement.subs.refParams'),
            url: '/content-management/reference-parameters',
            icon: Table
          },
          {
            title: t('menu.contentManagement.subs.pdf'),
            url: '/content-management/pdf',
            icon: Printer
          }
        ]
      },
      {
        id: 6,
        title: t('menu.administrativeTools.title'),
        url: '#',
        icon: Shield,
        items: [
          {
            title: t('menu.administrativeTools.subs.users'),
            url: '/administrative-tools/user-management/users',
            icon: Users
          },
          {
            title: t('menu.administrativeTools.subs.roles'),
            url: '/administrative-tools/user-management/roles',
            icon: UserCog
          },
          {
            title: t('menu.administrativeTools.subs.configuration'),
            url: '/administrative-tools/configuration',
            icon: Settings
          },
          {
            title: t('menu.administrativeTools.subs.logger'),
            url: '/administrative-tools/logger',
            icon: Cpu
          },
          {
            title: t('menu.administrativeTools.subs.devLogger'),
            url: '/administrative-tools/dev-logger',
            icon: Cpu
          }
        ]
      },
      {
        id: 7,
        title: t('menu.settings.title'),
        url: '#',
        icon: Settings,
        items: [
          {
            title: t('menu.account.title'),
            url: '/settings/account/profile',
            icon: UserCog
          },
          {
            title: t('menu.enterprise.title'),
            url: '/settings/account/my-enterprise',
            icon: Building2
          }
        ]
      }
    ]
  };
  const { open, toggleSidebar } = useSidebar();

  const hoverToggledRef = React.useRef(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (!open) {
      toggleSidebar();
      hoverToggledRef.current = true;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (hoverToggledRef.current) {
      toggleSidebar();
      hoverToggledRef.current = false;
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
