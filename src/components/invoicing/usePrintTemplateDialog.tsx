import React from 'react';
import { useDialog } from '@/components/shared/Dialogs';
import { PrintTemplateDialogContent } from '@/components/invoicing/shared/PrintTemplateDialog';
import { ResponseTemplateDto } from '@/types';

interface UsePrintTemplateDialogOptions {
  documentType: 'invoice' | 'quotation';
  documentId?: number;
  templates: ResponseTemplateDto[];
  isLoading?: boolean;
  isPrinting?: boolean;
  onConfirm: (templateId: string) => void;
  onClose?: () => void;
  className?: string;
}

export function usePrintTemplateDialog({
  documentType,
  documentId,
  templates,
  isLoading,
  isPrinting,
  onConfirm,
  onClose,
  className
}: UsePrintTemplateDialogOptions) {
  const closeDialogRef = React.useRef<() => void>(() => {});

  const { DialogFragment, openDialog, closeDialog } = useDialog({
    className: 'flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-5xl',
    onToggle: onClose,
    children: (isOpen) => (
      <PrintTemplateDialogContent
        isOpen={isOpen}
        documentType={documentType}
        documentId={documentId}
        templates={templates}
        isLoading={isLoading}
        isPrinting={isPrinting}
        onConfirm={onConfirm}
        onCancel={() => closeDialogRef.current()}
        className={className}
      />
    )
  });

  closeDialogRef.current = closeDialog;

  return {
    printTemplateDialog: DialogFragment,
    openPrintTemplateDialog: openDialog,
    closePrintTemplateDialog: closeDialog
  };
}
