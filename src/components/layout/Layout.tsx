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
  const clearRoutes = React.useCallback(() => {
    setRoutes([]);
  }, []);
  const breadcrumbContext = React.useMemo(() => ({
    routes,
    setRoutes,
    clearRoutes
  }), [routes, clearRoutes]);

  const [content, setContent] = React.useState<React.ReactNode>(null);
  const clearContent = React.useCallback(() => {
    setContent(null);
  }, []);
  const footerContext = React.useMemo(() => ({
    content,
    setContent,
    clearContent
  }), [content, clearContent]);

  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [floating, setFloating] = React.useState<React.ReactNode>(null);
  const setIntro = React.useCallback((newTitle: string, newDescription?: string) => {
    setTitle(newTitle);
    setDescription(newDescription || '');
  }, []);
  const clearIntro = React.useCallback(() => {
    setTitle('');
    setDescription('');
  }, []);
  const clearFloating = React.useCallback(() => {
    setFloating(null);
  }, []);
  const introContext = React.useMemo(() => ({
    title,
    description,
    floating,
    setIntro,
    setFloating,
    clearIntro,
    clearFloating
  }), [title, description, floating, setIntro, clearIntro, clearFloating]);

  const isMobile = useMediaQuery('(max-width: 425px)');

  const [enableMainOverflow, setEnableMainOverflow] = React.useState<boolean>(false);
  const clearEnableMainOverflow = React.useCallback(() => {
    setEnableMainOverflow(false);
  }, []);
  const uiContext = React.useMemo(() => ({
    enableMainOverflow,
    setEnableMainOverflow,
    clearEnableMainOverflow
  }), [enableMainOverflow, clearEnableMainOverflow]);

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
