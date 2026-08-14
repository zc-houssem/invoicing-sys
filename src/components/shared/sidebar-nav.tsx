import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';
import { ExternalLink } from 'lucide-react';

export type SidebarNavItem = {
  href: string;
  title: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  disabled?: boolean;
  external?: boolean;
  description?: string;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};

export interface SidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  items?: SidebarNavItem[];
  sections?: SidebarNavSection[];
  onSelect?: (item: SidebarNavItem) => void;
  activeHref?: string;
}

const NavButton = ({
  item,
  isActive,
  onNavigate
}: {
  item: SidebarNavItem;
  isActive: boolean;
  onNavigate: (item: SidebarNavItem) => void;
}) => (
  <Button
    variant="ghost"
    key={item.href}
    disabled={item.disabled}
    onClick={() => onNavigate(item)}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'w-full justify-between h-9.5 px-3 py-2 text-xs font-medium transition-all duration-300 ease-out rounded-lg relative',
      isActive
        ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/10 hover:text-primary'
        : 'text-muted-foreground hover:text-primary hover:bg-accent/50 hover:translate-x-1',
      item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      'group flex items-center'
    )}>
    {/* Subtle active indicator bar */}
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
    )}

    <div className="flex items-center gap-3 min-w-0 truncate z-10 pl-1">
      {item.icon && (
        <span
          className={cn(
            'shrink-0 transition-all duration-300 ease-out',
            isActive
              ? 'text-primary scale-110'
              : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
          )}>
          {item.icon}
        </span>
      )}
      <span className="truncate tracking-wide">{item.title}</span>
    </div>

    <div className="flex items-center gap-2 shrink-0 ml-2 z-10">
      {item.badge !== undefined && (
        <Badge
          variant={item.badgeVariant || (isActive ? 'default' : 'secondary')}
          className={cn(
            'text-[10px] px-2 py-0 h-5 font-semibold transition-colors duration-300',
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'group-hover:bg-primary/20 group-hover:text-primary'
          )}>
          {item.badge}
        </Badge>
      )}
      {item.external && (
        <ExternalLink
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors duration-300',
            isActive
              ? 'text-primary opacity-80'
              : 'opacity-50 group-hover:text-primary group-hover:opacity-100'
          )}
        />
      )}
    </div>
  </Button>
);

export default function SidebarNav({
  className,
  items = [],
  sections,
  onSelect,
  activeHref,
  ...props
}: SidebarNavProps) {
  const router = useRouter();

  const flatItems = React.useMemo(
    () => (sections ? sections.flatMap((section) => section.items) : items),
    [sections, items]
  );

  const normalizedPath = React.useMemo(() => {
    if (activeHref) return activeHref;
    if (!router || !router.asPath) return '';
    return router.asPath.split('?')[0].split('#')[0];
  }, [router, activeHref]);

  const activeItem = React.useMemo(
    () => flatItems.find((item) => item.href === normalizedPath) || flatItems[0],
    [flatItems, normalizedPath]
  );

  const handleNavigate = (item: SidebarNavItem) => {
    if (item.disabled) return;

    if (onSelect) {
      onSelect(item);
    }

    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
    }
  };

  const handleMobileSelect = (href: string) => {
    const targetItem = flatItems.find((i) => i.href === href);
    if (targetItem) {
      handleNavigate(targetItem);
    }
  };

  const isActive = (href: string) => {
    if (activeHref) return activeHref === href;
    if (!normalizedPath) return false;
    return normalizedPath === href;
  };

  return (
    <>
      {/* Mobile/Tablet view select dropdown */}
      <div className="lg:hidden p-1">
        <Select value={activeItem?.href || ''} onValueChange={handleMobileSelect}>
          <SelectTrigger className="h-11 w-full bg-background border-input font-medium">
            <div className="flex items-center gap-2.5 truncate">
              {activeItem?.icon && <span className="shrink-0">{activeItem.icon}</span>}
              <span className="truncate">{activeItem?.title || 'Navigation'}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {flatItems.map((item) => (
              <SelectItem key={item.href} value={item.href} disabled={item.disabled}>
                <div className="flex items-center justify-between w-full gap-3 py-0.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.icon && (
                      <span className="shrink-0 text-muted-foreground">{item.icon}</span>
                    )}
                    <span className="font-medium text-sm truncate">{item.title}</span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge
                      variant={item.badgeVariant || 'secondary'}
                      className="text-[10px] px-1.5 py-0 shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop view sidebar nav */}
      <div className="hidden w-full px-1 bg-background py-2 lg:block">
        <nav
          aria-label="Sidebar navigation"
          className={cn('flex flex-col space-y-1.5', className)}
          {...props}>
          {sections
            ? sections.map((section, sectionIdx) => (
                <div key={section.title || sectionIdx} className="space-y-1">
                  {section.title && (
                    <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      {section.title}
                    </p>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavButton
                        key={item.href}
                        item={item}
                        isActive={isActive(item.href)}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </div>
                </div>
              ))
            : items.map((item) => (
                <NavButton
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onNavigate={handleNavigate}
                />
              ))}
        </nav>
      </div>
    </>
  );
}
