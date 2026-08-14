import React from 'react';
import { useDialog } from '@/components/shared/Dialogs';
import { PrintTemplateDialogContent } from '@/components/invoicing-commons/PrintTemplateDialog';
import { ResponseTemplateDto, ResponseTemplateHeaderDto, ResponseTemplateFooterDto } from '@/types';

interface UsePrintTemplateDialogOptions {
  documentType: 'invoice' | 'quotation';
  documentId?: number;
  templates: ResponseTemplateDto[];
  headers?: ResponseTemplateHeaderDto[];
  footers?: ResponseTemplateFooterDto[];
  isLoading?: boolean;
  isPrinting?: boolean;
  onConfirm: (templateId: string, options?: { includeHeader: boolean; includeFooter: boolean }) => void;
  onClose?: () => void;
  className?: string;
}

export function usePrintTemplateDialog({
  documentType,
  documentId,
  templates,
  headers,
  footers,
  isLoading,
  isPrinting,
  onConfirm,
  onClose,
  className
}: UsePrintTemplateDialogOptions) {
  const closeDialogRef = React.useRef<() => void>(() => {});

  const { DialogFragment, openDialog, closeDialog } = useDialog({
    className: 'flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[75vw]',
    onToggle: onClose,
    children: (isOpen) => (
      <PrintTemplateDialogContent
        isOpen={isOpen}
        documentType={documentType}
        documentId={documentId}
        templates={templates}
        headers={headers}
        footers={footers}
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
