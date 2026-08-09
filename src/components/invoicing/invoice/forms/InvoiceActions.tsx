import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseInvoiceWorkflowDto } from '@/types/core/invoicing/invoice';
import { useMutation } from '@tanstack/react-query';
import { Copy, Printer, Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { openPdfBlob } from '@/utils/pdf.utils';
import React from 'react';
import { useDocumentTemplates } from '@/hooks/content/core/useDocumentTemplates';
import { PrintTemplateDialog } from '../../shared/PrintTemplateDialog';

interface InvoiceActionsProps {
  className?: string;
  workflow: ResponseInvoiceWorkflowDto | null;
  save: () => void;
  reload: () => void;
  reset: () => void;
  isSavePending?: boolean;
}

export const InvoiceActions = ({
  className,
  workflow,
  save,
  reload,
  reset,
  isSavePending
}: InvoiceActionsProps) => {
  const { t } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const router = useRouter();
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const { data: templates = [], isLoading: isTemplatesLoading } = useDocumentTemplates('invoice');

  const { mutate: next, isPending: isNextPending } = useMutation({
    mutationFn: async (event: string) =>
      api.invoicing.invoice.workflow.next(workflow?.invoice?.id!, event),
    onSuccess: () => {
      reload();
      toast.success('Invoice status updated successfully');
    }
  });

  const { mutate: duplicateInvoice, isPending: isDuplicatePending } = useMutation({
    mutationFn: async () => api.invoicing.invoice.duplicate(workflow?.invoice?.id!),
    onSuccess: (data) => {
      toast.success('Invoice duplicated successfully');
      router.push(`/selling/invoices/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to duplicate invoice');
    }
  });

  const { mutate: printInvoice, isPending: isPrintPending } = useMutation({
    mutationFn: async (templateId: string) => {
      const id = workflow?.invoice?.id;
      if (!id) throw new Error('Invoice not found');
      return api.invoicing.invoice.downloadPdf(id, templateId);
    },
    onSuccess: (pdf) => {
      openPdfBlob(pdf);
      setIsPrintDialogOpen(false);
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

  const handlePrintClick = () => {
    if (templates.length === 0 && !isTemplatesLoading) {
      toast.error(
        tInvoicing(
          'invoice.print_dialog.no_templates',
          'No templates are available for this document type.'
        )
      );
      return;
    }
    setIsPrintDialogOpen(true);
  };

  return (
    <div className={cn('flex flex-col gap-2 items-start justify-center w-full', className)}>
      <Button
        variant={'default'}
        className="w-full"
        disabled={isNextPending || isSavePending}
        onClick={save}>
        <Save />
        <span>{t('commands.save')}</span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.isPrintable || isNextPending || isPrintPending || isTemplatesLoading}
        onClick={handlePrintClick}>
        <Printer />
        <span>{isPrintPending ? t('commands.printing') : t('commands.print')}</span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.invoice?.id || isDuplicatePending || isNextPending}
        onClick={() => duplicateInvoice()}>
        <Copy />
        <span>{isDuplicatePending ? t('commands.duplicating') : t('commands.duplicate')}</span>
      </Button>
      {workflow?.nextSteps.map((step) => (
        <Button
          key={step.label}
          variant={'outline'}
          className="w-full"
          disabled={isNextPending}
          onClick={() => next(step.label)}>
          {tInvoicing(`invoice.actions.${step.label.toLowerCase().replace(/ /g, '_')}`, step.label)}
        </Button>
      ))}
      <Button
        variant={'ghost'}
        className="w-full"
        disabled={!workflow?.isUpdatable}
        onClick={reset}>
        <Repeat2 />
        <span>{t('commands.reset')}</span>
      </Button>

      <PrintTemplateDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        documentType="invoice"
        documentId={workflow?.invoice?.id}
        templates={templates}
        isLoading={isTemplatesLoading}
        isPrinting={isPrintPending}
        onConfirm={printInvoice}
      />
    </div>
  );
};
