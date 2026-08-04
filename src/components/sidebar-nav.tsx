import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/router';

export type SidebarNavItem = {
  href: string;
  title: string;
  icon: JSX.Element;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: SidebarNavItem[];
  sections?: SidebarNavSection[];
}

const NavButton = ({
  item,
  isActive,
  onNavigate
}: {
  item: SidebarNavItem;
  isActive: boolean;
  onNavigate: (href: string) => void;
}) => (
  <Button
    variant="link"
    key={item.href}
    onClick={() => onNavigate(item.href)}
    className={cn(
      isActive ? 'bg-zinc-200 dark:bg-zinc-700' : 'hover:underline',
      'justify-start'
    )}>
    <span className="mr-2">{item.icon}</span>
    {item.title}
  </Button>
);

export default function SidebarNav({ className, items = [], sections, ...props }: SidebarNavProps) {
  const router = useRouter();
  const flatItems = sections ? sections.flatMap((section) => section.items) : items;
  const [val, setVal] = useState(router.pathname ?? '/settings');

  const handleSelect = (e: string) => {
    setVal(e);
    router.push(e);
  };

  const isActive = (href: string) => router.asPath === href;

  return (
    <>
      <div className="md:hidden p-1">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {flatItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden w-full overflow-x-auto bg-background py-2 md:block">
        <nav
          className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
          {...props}>
          {sections
            ? sections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </p>
                  {section.items.map((item) => (
                    <NavButton
                      key={item.href}
                      item={item}
                      isActive={isActive(item.href)}
                      onNavigate={handleSelect}
                    />
                  ))}
                </div>
              ))
            : items.map((item) => (
                <NavButton
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onNavigate={handleSelect}
                />
              ))}
        </nav>
      </div>
    </>
  );
}
