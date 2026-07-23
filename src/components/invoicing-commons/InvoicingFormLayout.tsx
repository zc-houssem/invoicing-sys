import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import React from 'react';

interface InvoicingFormLayoutProps {
  className?: string;
  isMobile: boolean;
  main: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarTitle?: string;
  sidebarDescription?: string;
}

export const InvoicingFormLayout = ({
  className,
  isMobile,
  main,
  sidebar,
  sidebarTitle = 'Actions',
  sidebarDescription
}: InvoicingFormLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const sidebarContent = <div className="flex flex-col gap-4">{sidebar}</div>;

  return (
    <div className={cn('py-4', className)}>
      {isMobile && (
        <div className="mb-4 flex justify-end">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label={sidebarTitle}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{sidebarTitle}</SheetTitle>
                {sidebarDescription && <SheetDescription>{sidebarDescription}</SheetDescription>}
              </SheetHeader>
              <div className="mt-4">{sidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <div className={cn('flex items-start gap-4', isMobile ? 'flex-col' : 'flex-row')}>
        <div className="min-w-0 flex-1 rounded-lg border p-6">{main}</div>
        {!isMobile && (
          <aside className="sticky top-0 w-115 shrink-0 self-start rounded-lg border bg-card p-6">
            {sidebarContent}
          </aside>
        )}
      </div>
    </div>
  );
};
