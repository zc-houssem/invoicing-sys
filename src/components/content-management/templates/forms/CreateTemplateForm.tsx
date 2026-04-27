import { cn } from '@/lib/utils';
import { PDFEditor } from '../pdfme/PDFTemplateEditor';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useCreateTemplateFormStructure } from './useCreateTemplateFormStructure';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { useIntro } from '@/context/IntroContext';
import { useFooter } from '@/context/FooterContext';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CreateTemplateFormProps {
  className?: string;
}

export const CreateTemplateForm = ({ className }: CreateTemplateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const templateStore = useTemplateStore();
  const { formStructure } = useCreateTemplateFormStructure({ store: templateStore });

  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.('Create Template', 'Fill out the form below to create a new document template.');

    return () => {
      templateStore.reset();
      clearIntro?.();
    };
  }, []);

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden pb-4', className)}>
      <ResizablePanelGroup
        orientation={isMobile ? 'vertical' : 'horizontal'}
        className=" rounded-lg border flex-1">
        <ResizablePanel defaultSize={isMobile ? '100%' : '75%'} className="bg-card">
          <PDFEditor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={isMobile ? '0%' : '25%'}
          minSize={isMobile ? '0%' : '20%'}
          maxSize={isMobile ? '0%' : '30%'}>
          <div className="flex items-center justify-center p-6 container mx-auto">
            <FormBuilder structure={formStructure} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
