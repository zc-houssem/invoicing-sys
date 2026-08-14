'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { EnterpriseLogo } from '@/components/contacts/enterprise/EnterpriseLogo';

type Team = {
  id: number;
  name: string;
  logoId?: number;
  plan: string;
};

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { activeCompanyId, setActiveCompanyId } = useActiveCompanyContext();
  const { t } = useTranslation('common');

  const activeTeam = React.useMemo(() => {
    if (teams.length === 0) return undefined;
    return teams.find((team) => team.id === activeCompanyId) ?? teams[0];
  }, [teams, activeCompanyId]);

  React.useEffect(() => {
    if (activeTeam && activeCompanyId !== activeTeam.id) {
      setActiveCompanyId(activeTeam.id);
    }
  }, [activeTeam, activeCompanyId, setActiveCompanyId]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <EnterpriseLogo
                logoId={activeTeam.logoId}
                name={activeTeam.name}
                className="size-8"
                fallbackClassName="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t('menu.contacts.subs.enterprises')}
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setActiveCompanyId(team.id)}
                className="gap-2 p-2">
                <EnterpriseLogo
                  logoId={team.logoId}
                  name={team.name}
                  className="size-6 rounded-md"
                  fallbackClassName="rounded-md bg-muted text-[10px] font-medium"
                />
                <span className="text-xs">{team.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push('/settings/account/enterprise/new')}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-card">
                <Plus className="size-4" />
              </div>
              <div className="text-xs font-medium">{t('menu.enterprise.add')}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
