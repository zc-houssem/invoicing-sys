import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { BreadcrumbContext, BreadcrumbRoute } from '../../context/BreadcrumbContext';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { IntroContext } from '@/context/IntroContext';
import { FooterContext } from '@/context/FooterContext';
import { UIContext } from '@/context/UIContext';
import { PageHeader } from './PageHeader';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { Footer } from './Footer';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
    clearRoutes: () => {
      setRoutes?.([]);
    }
  };

  const [content, setContent] = React.useState<React.ReactNode>(null);
  const footerContext = {
    content,
    setContent,
    clearContent: () => {
      setContent?.(null);
    }
  };

  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [floating, setFloating] = React.useState<React.ReactNode>(null);
  const introContext = {
    title,
    description,
    floating,
    setIntro: (title: string, description?: string) => {
      setTitle(title);
      setDescription(description || '');
    },
    setFloating,
    clearIntro: () => {
      setTitle('');
      setDescription('');
    },
    clearFloating: () => {
      setFloating(null);
    }
  };

  const isMobile = useMediaQuery('(max-width: 425px)');

  const [enableMainOverflow, setEnableMainOverflow] = React.useState<boolean>(false);
  const uiContext = {
    enableMainOverflow,
    setEnableMainOverflow,
    clearEnableMainOverflow: () => {
      setEnableMainOverflow?.(false);
    }
  };

  return (
    <div
      className={cn(
        'flex md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr] overflow-hidden fullscreen',
        className
      )}>
      <SidebarProvider className="flex flex-row flex-1 overflow-hidden min-w-screen max-w-screen">
        <BreadcrumbContext.Provider value={breadcrumbContext}>
          <IntroContext.Provider value={introContext}>
            <FooterContext.Provider value={footerContext}>
              <UIContext.Provider value={uiContext}>
                <div className="flex flex-row flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <AppSidebar />
                  {/* Header , Main & Footer */}
                  <div className="flex flex-col flex-1 overflow-hidden bg-background">
                    <Header />
                    <main
                      className={cn(
                        'flex flex-col flex-1 min-h-0',
                        enableMainOverflow ? 'overflow-auto' : 'overflow-hidden',
                        isMobile ? 'px-4' : 'px-6',
                        className
                      )}>
                      {(title || description) && <PageHeader className="py-4" />}
                      {children}
                    </main>
                    {content && <Footer />}
                  </div>
                </div>
              </UIContext.Provider>
            </FooterContext.Provider>
          </IntroContext.Provider>
        </BreadcrumbContext.Provider>
      </SidebarProvider>
    </div>
  );
};
