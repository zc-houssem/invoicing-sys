import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/api';
import { openPdfBlob } from '@/utils/pdf.utils';
import { useDocumentTemplates } from '@/hooks/content/core/useDocumentTemplates';
import { usePrintTemplateDialog } from '../../../components/invoicing/usePrintTemplateDialog';

export function useInvoicePrint(documentId?: number) {
  const { t: tInvoicing } = useTranslation('invoicing');
  const [targetId, setTargetId] = React.useState<number | undefined>(documentId);
  const [shouldOpenPrint, setShouldOpenPrint] = React.useState(false);
  const targetIdRef = React.useRef<number | undefined>(documentId);
  const closePrintTemplateDialogRef = React.useRef<() => void>(() => {});
  const { data: templates = [], isLoading: isTemplatesLoading } = useDocumentTemplates('invoice');

  React.useEffect(() => {
    setTargetId(documentId);
    targetIdRef.current = documentId;
  }, [documentId]);

  const { mutate: printInvoice, isPending: isPrintPending } = useMutation({
    mutationFn: async (templateId: string) => {
      const id = targetIdRef.current;
      if (!id) throw new Error('Invoice not found');
      return api.invoicing.invoice.downloadPdf(id, templateId);
    },
    onSuccess: (pdf) => {
      openPdfBlob(pdf);
      closePrintTemplateDialogRef.current();
      toast.success(
        tInvoicing('invoice.messages.print_success', 'Invoice PDF generated successfully')
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          tInvoicing('invoice.messages.print_failed', 'Failed to generate invoice PDF')
      );
    }
  });

  const { printTemplateDialog, openPrintTemplateDialog, closePrintTemplateDialog } =
    usePrintTemplateDialog({
      documentType: 'invoice',
      documentId: targetId,
      templates,
      isLoading: isTemplatesLoading,
      isPrinting: isPrintPending,
      onConfirm: printInvoice,
      onClose: () => {
        setTargetId(documentId);
        targetIdRef.current = documentId;
      }
    });

  closePrintTemplateDialogRef.current = closePrintTemplateDialog;

  React.useEffect(() => {
    if (!shouldOpenPrint || !targetId) return;
    openPrintTemplateDialog();
    setShouldOpenPrint(false);
  }, [shouldOpenPrint, targetId, openPrintTemplateDialog]);

  const openPrint = (id?: number) => {
    const resolvedId = id ?? targetIdRef.current;
    if (!resolvedId) return;

    if (templates.length === 0 && !isTemplatesLoading) {
      toast.error(
        tInvoicing(
          'invoice.print_dialog.no_templates',
          'No templates are available for this document type.'
        )
      );
      return;
    }

    targetIdRef.current = resolvedId;
    setTargetId(resolvedId);
    setShouldOpenPrint(true);
  };

  return {
    printTemplateDialog,
    openPrint,
    isPrintPending,
    isTemplatesLoading
  };
}
