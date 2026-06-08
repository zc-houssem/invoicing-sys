import React from 'react';
import { Expand, Package, PackageOpen, X, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePDFTemplateVariableDialog } from './PDFTemplateVariableDialog';
import { ResponseTemplateTypeDto } from '@/types';

interface PDFTemplateEditorFieldActionsProps {
  className?: string;
  toggle: () => void;
  exportCallback?: () => void;
  importCallback?: () => void;
  isFullscreen: boolean;
  templateType?: ResponseTemplateTypeDto;
  onInsertVariables?: (variableKeys: string[]) => void;
}

export const PDFTemplateEditorFieldActions = ({
  className,
  isFullscreen,
  exportCallback,
  importCallback,
  toggle,
  templateType,
  onInsertVariables
}: PDFTemplateEditorFieldActionsProps) => {
  const variables = (templateType?.variables || []) as any[];

  const { variableDialog, openVariableDialog } = usePDFTemplateVariableDialog({
    variables,
    onInsertVariables
  });

  return (
    <div className={cn('flex flex-col lg:flex-row gap-2 bg-card p-2 rounded-lg', className)}>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={toggle}>
        {isFullscreen ? <X className="size-6" /> : <Expand className="size-6" />}
        {!isFullscreen && <span className="font-bold">Expand</span>}
      </Button>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={exportCallback}>
        <Package />
        <span className="font-bold">Export</span>
      </Button>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={importCallback}>
        <PackageOpen />
        <span className="font-bold">Import</span>
      </Button>

      <Button
        type="button"
        variant={'outline'}
        size={'sm'}
        className="ml-auto"
        onClick={openVariableDialog}>
        <List className="size-4 mr-2" />
        <span className="font-bold"> Insert Variables</span>
      </Button>
      {variableDialog}
    </div>
  );
};
