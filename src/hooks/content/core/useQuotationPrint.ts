import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/api';
import { openPdfBlob } from '@/utils/pdf.utils';
import { useDocumentTemplates } from '@/hooks/content/core/useDocumentTemplates';
import { useQuery } from '@tanstack/react-query';
import { usePrintTemplateDialog } from '../../../components/invoicing/usePrintTemplateDialog';

export function useQuotationPrint(documentId?: number) {
  const { t: tInvoicing } = useTranslation('invoicing');
  const [targetId, setTargetId] = React.useState<number | undefined>(documentId);
  const [shouldOpenPrint, setShouldOpenPrint] = React.useState(false);
  const targetIdRef = React.useRef<number | undefined>(documentId);
  const closePrintTemplateDialogRef = React.useRef<() => void>(() => {});
  const { data: templates = [], isLoading: isTemplatesLoading } = useDocumentTemplates('quotation');
  
  const { data: headers = [], isLoading: isHeadersLoading } = useQuery({
    queryKey: ['template-headers'],
    queryFn: () => api.core.templateHeader.findAll({ sort: 'name,ASC' })
  });

  const { data: footers = [], isLoading: isFootersLoading } = useQuery({
    queryKey: ['template-footers'],
    queryFn: () => api.core.templateFooter.findAll({ sort: 'name,ASC' })
  });

  React.useEffect(() => {
    setTargetId(documentId);
    targetIdRef.current = documentId;
  }, [documentId]);

  const { mutate: printQuotation, isPending: isPrintPending } = useMutation({
    mutationFn: async ({ templateId, options }: { templateId: string, options?: { includeHeader: boolean; includeFooter: boolean } }) => {
      const id = targetIdRef.current;
      if (!id) throw new Error('Quotation not found');
      return api.invoicing.quotation.downloadPdf(id, templateId, options);
    },
    onSuccess: (pdf) => {
      openPdfBlob(pdf);
      closePrintTemplateDialogRef.current();
      toast.success(
        tInvoicing('quotation.messages.print_success', 'Quotation PDF generated successfully')
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          tInvoicing('quotation.messages.print_failed', 'Failed to generate quotation PDF')
      );
    }
  });

  const { printTemplateDialog, openPrintTemplateDialog, closePrintTemplateDialog } =
    usePrintTemplateDialog({
      documentType: 'quotation',
      documentId: targetId,
      templates,
      headers,
      footers,
      isLoading: isTemplatesLoading || isHeadersLoading || isFootersLoading,
      isPrinting: isPrintPending,
      onConfirm: (templateId, options) => printQuotation({ templateId, options }),
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
          'quotation.print_dialog.no_templates',
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
