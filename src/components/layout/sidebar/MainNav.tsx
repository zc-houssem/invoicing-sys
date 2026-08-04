import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import Link from 'next/link';

export type NavSubItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavSubItem[];
};

export type NavItem = {
  id: number;
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

const NavSubMenu = ({ items }: { items: NavSubItem[] }) => (
  <SidebarMenuSub>
    {items.map((subItem) =>
      subItem.items && subItem.items.length > 0 ? (
        <Collapsible key={subItem.title} asChild defaultOpen className="group/nested">
          <SidebarMenuSubItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton>
                {subItem.icon && <subItem.icon className="mr-2" />}
                <span>{subItem.title}</span>
                <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-2 border-l pl-2">
                {subItem.items.map((nestedItem) => (
                  <SidebarMenuSubItem key={nestedItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={nestedItem.url}>
                        {nestedItem.icon && <nestedItem.icon className="mr-2" />}
                        <span>{nestedItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      ) : (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton asChild>
            <Link href={subItem.url}>
              {subItem.icon && <subItem.icon className="mr-2" />}
              <span>{subItem.title}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )
    )}
  </SidebarMenuSub>
);

export function MainNav({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.id}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <NavSubMenu items={item.items} />
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
