import { useFullScreen } from '@/hooks/useFullScreen';
import React from 'react';
import type { Template } from '@pdfme/common';
import { BLANK_PDF } from '@pdfme/common';
import { Designer } from '@pdfme/ui';
import { text, image, date, table, multiVariableText } from '@pdfme/schemas';
import { loadFonts } from './loadFonts';
import { DEFAULT_ITEMS_TABLE_SCHEMA } from './pdfGeneration';
import { cn } from '@/lib/utils';
import { ApplyPDFTemplateEditorStyles } from './ApplyPDFTemplateEditoStyles';
import { PDFTemplateEditorFieldActions } from './PDFTemplateEditorFieldActions';
import { ResponseTemplateTypeDto } from '@/types';

interface PDFEditorProps {
  key: string;
  className?: string;
  file?: File | null;
  variables?: any;
  setVariables?: (variables: any) => void;
  exportCallback?: () => void;
  importCallback?: () => void;
  templateType?: ResponseTemplateTypeDto;
}

export const PDFEditor = ({
  key,
  className,
  file,
  variables,
  setVariables,
  exportCallback,
  importCallback,
  templateType
}: PDFEditorProps) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const initializedRef = React.useRef(false);
  const designerRef = React.useRef<Designer | null>(null);
  const [basePdf, setBasePdf] = React.useState<ArrayBuffer | string>(BLANK_PDF);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { isFullscreen, toggle } = useFullScreen({
    onToggle(isFullscreen) {
      const hamburgerButton = document.getElementById('nav-toggler');
      if (hamburgerButton) hamburgerButton.style.display = isFullscreen ? 'none' : '';
    }
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;
    let designer: Designer | null = null;

    const init = async () => {
      if (typeof window === 'undefined') return;

      const domContainer = containerRef.current;
      if (!domContainer) return;
      let buffer: ArrayBuffer | string = BLANK_PDF;

      if (file) {
        try {
          buffer = await file.arrayBuffer();
          setBasePdf(buffer);
        } catch (err) {
          console.error(err);
        }
      }

      if (cancelled) return;

      const template: Template = variables
        ? {
            basePdf: buffer,
            ...variables
          }
        : {
            basePdf: buffer,
            schemas: [[]]
          };

      const plugins = {
        text,
        image,
        date,
        table,
        multiVariableText
      };

      const fonts = await loadFonts();

      if (cancelled) return;

      designer = new Designer({
        domContainer,
        template,
        options: {
          zoomLevel: 1,
          sidebarOpen: true,
          font: fonts
        },
        plugins
      });

      initializedRef.current = true;
      designerRef.current = designer;

      designer.onChangeTemplate((tpl) => {
        const { basePdf: _basePdf, ...rest } = tpl;
        setVariables?.(rest as Template);
      });
    };

    if (!initializedRef.current) {
      init();
    }

    return () => {
      cancelled = true;
      if (designer) {
        designer.destroy();
        designerRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [isMounted, file]);

  React.useEffect(() => {
    if (designerRef.current && basePdf) {
      designerRef.current.updateTemplate({
        basePdf,
        ...variables
      });
    }
  }, [key]);

  const handleInsertVariables = (variableKeys: string[]) => {
    if (!designerRef.current) return;

    const currentTemplate = designerRef.current.getTemplate();
    const newSchemas = [...currentTemplate.schemas];
    if (newSchemas.length === 0) newSchemas.push([]);

    variableKeys.forEach((variableKey, index) => {
      if (variableKey === 'items') {
        newSchemas[0].push({
          type: 'table',
          position: { x: 10, y: 60 + index * 10 },
          width: 190,
          height: 40,
          name: variableKey,
          ...DEFAULT_ITEMS_TABLE_SCHEMA
        } as any);
      } else if (variableKey.includes('logo')) {
        newSchemas[0].push({
          type: 'image',
          position: { x: 10, y: 10 + index * 10 },
          width: 50,
          height: 30,
          name: variableKey,
          content: ''
        } as any);
      } else {
        newSchemas[0].push({
          type: 'text',
          position: { x: 10, y: 10 + index * 10 },
          width: 50,
          height: 10,
          name: variableKey,
          content: `{${variableKey}}`
        } as any);
      }
    });

    designerRef.current.updateTemplate({ ...currentTemplate, schemas: newSchemas });
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full gap-2 bg-background transition-all duration-300 ease-in-out',
        isFullscreen && 'fixed inset-0 z-10 bg-background p-4 animate-in fade-in zoom-in-95',
        className
      )}>
      {isMounted ? <ApplyPDFTemplateEditorStyles /> : null}
      <PDFTemplateEditorFieldActions
        isFullscreen={isFullscreen}
        toggle={toggle}
        exportCallback={exportCallback}
        importCallback={importCallback}
        templateType={templateType}
        onInsertVariables={handleInsertVariables}
      />

      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn('w-full', isFullscreen ? 'h-full' : 'flex-1 overflow-hidden')}
      />
    </div>
  );
};
