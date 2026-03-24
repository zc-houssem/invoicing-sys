import * as React from 'react';
import {
  BookUser,
  Building,
  Cpu,
  File,
  FileCog,
  FileText,
  LayoutDashboard,
  Magnet,
  Package,
  Printer,
  Settings,
  Shield,
  ShoppingCart,
  UserCog,
  Users,
  Wallet,
  Wrench,
  X
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { MainNav } from './MainNav';
import { TeamSwitcher } from './TeamSwitcher';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import logoLight from 'src/assets/logo.png';
import logoDark from 'src/assets/logo-light.png';
import { useTranslation } from 'react-i18next';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { theme } = useTheme();
  const { t: tCommon } = useTranslation('common');

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg'
    },
    teams: [
      {
        name: 'Zedney Creative',
        logo: React.useMemo(() => {
          return (
            <Image
              src={theme == 'light' ? logoLight : logoDark}
              alt="logo"
              onClick={() => router.push('/dashboard')}
            />
          );
        }, [theme, router]),
        plan: 'Free'
      }
    ],
    navMain: [
      {
        id: 1,
        title: tCommon('menu.dashboard'),
        url: '#',
        icon: LayoutDashboard,
        items: []
      },
      {
        id: 2,
        title: tCommon('menu.contacts'),
        url: '#',
        icon: Users,
        items: [
          {
            title: tCommon('submenu.firms'),
            url: '/contacts/firms',
            icon: Building
          },
          {
            title: tCommon('submenu.interlocutors'),
            url: '/contacts/interlocutors',
            icon: BookUser
          }
        ]
      },
      {
        id: 3,
        title: tCommon('menu.selling'),
        url: '#',
        icon: Package,
        items: [
          {
            title: '_Devis',
            url: '/selling/_quotations',
            icon: File
          },
          {
            title: tCommon('submenu.quotations'),
            url: '/selling/quotations',
            icon: File
          },
          {
            title: tCommon('submenu.invoices'),
            url: '/selling/invoices',
            icon: FileText
          },
          {
            title: tCommon('submenu.payments'),
            url: '/selling/payments',
            icon: Wallet
          }
        ]
      },
      {
        id: 4,
        title: tCommon('menu.buying'),
        url: '#',
        icon: ShoppingCart,
        items: [
          {
            title: tCommon('submenu.quotations'),
            url: '/buying/quotation',
            icon: File
          },
          {
            title: tCommon('submenu.invoices'),
            url: '/buying/invoices',
            icon: FileText
          },
          {
            title: tCommon('submenu.payments'),
            url: '/buying/payments',
            icon: Wallet
          },
          {
            title: tCommon('submenu.withholding'),
            url: '/buying/withholding',
            icon: Magnet
          }
        ]
      },
      {
        id: 5,
        title: 'Content Management',
        url: '/content-management',
        icon: X,
        items: [
          {
            title: 'Bank Accounts',
            url: '/content-management/bank-accounts',
            icon: Wallet
          }
        ]
      },
      {
        id: 6,
        title: tCommon('menu.administrative_tools'),
        url: '#',
        icon: Shield,
        items: [
          {
            title: tCommon('submenu.user_management'),
            url: '/administrative-tools/user-management/users',
            icon: Users
          },
          {
            title: tCommon('submenu.logger'),
            url: '/administrative-tools/logger',
            icon: Cpu
          }
        ]
      },
      {
        id: 7,
        title: tCommon('menu.settings'),
        url: '#',
        icon: Settings,
        items: [
          {
            title: tCommon('submenu.account'),
            url: '/settings/account/profile',
            icon: UserCog
          },
          {
            title: tCommon('submenu.system'),
            url: '/settings/system/activity',
            icon: FileCog
          },
          {
            title: tCommon('submenu.pdf'),
            url: '/settings/pdf/live',
            icon: Printer
          },
          {
            title: tCommon('submenu.other'),
            url: '#',
            icon: Wrench
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
