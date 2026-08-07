import React from 'react';
import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseQuotationWorkflowDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Copy, Printer, Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { generatePdfDocument, openPdfInNewTab } from '@/components/content-management/templates/pdfme/pdfGeneration';
import { loadLogoAsBase64 } from '@/components/content-management/templates/pdfme/pdfLogoLoader';
import { buildQuotationPdfInputMapping } from '@/components/invoicing/quotation/utils/quotationPdfInputMapping';
import { useInvoiceStore } from '@/hooks/stores/useInvoiceStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface QuotationActionsProps {
  className?: string;
  workflow: ResponseQuotationWorkflowDto | null;
  save: () => void;
  reload: () => void;
  reset: () => void;
  isSavePending?: boolean;
}

export const QuotationActions = ({
  className,
  workflow,
  save,
  reload,
  reset,
  isSavePending
}: QuotationActionsProps) => {
  const { t } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCountry } = useTranslation('country');
  const router = useRouter();
  const invoiceStore = useInvoiceStore();
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = React.useState(false);
  const [isAdditionalInvoiceDialogOpen, setIsAdditionalInvoiceDialogOpen] = React.useState(false);

  const { mutate: next, isPending: isNextPending } = useMutation({
    mutationFn: async (event: string) =>
      api.invoicing.quotation.workflow.next(workflow?.quotation?.id!, event),
    onSuccess: () => {
      reload();
      toast.success(
        tInvoicing('quotation.messages.status_updated', 'Quotation status updated successfully')
      );
    }
  });

  const { mutate: duplicateQuotation, isPending: isDuplicatePending } = useMutation({
    mutationFn: async () => api.invoicing.quotation.duplicate(workflow?.quotation?.id!),
    onSuccess: (data) => {
      toast.success(tInvoicing('quotation.messages.duplicate_success', 'Quotation duplicated successfully'));
      router.push(`/selling/quotations/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || tInvoicing('quotation.messages.duplicate_failed', 'Failed to duplicate quotation')
      );
    }
  });

  const { mutate: createInvoice, isPending: isCreateInvoicePending } = useMutation({
    mutationFn: async (id: number) => api.invoicing.invoice.fromQuotation(id),
    onSuccess: (data) => {
      toast.success(tInvoicing('quotation.messages.invoice_created', 'Invoice created successfully'));
      router.push(`/selling/invoices/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || tInvoicing('quotation.messages.invoice_failed', 'Failed to create invoice')
      );
    }
  });

  const handleNext = (stepLabel: string) => {
    if (stepLabel === 'To Invoice') {
      setIsInvoiceDialogOpen(true);
    } else {
      next(stepLabel);
    }
  };

  const handleCreateInvoice = () => {
    const qId = workflow?.quotation?.id;
    if (qId) {
      createInvoice(qId);
    }
  };

  const handleCreateInvoiceAndUpdateStatus = () => {
    next('To Invoice');
    handleCreateInvoice();
  };

  const { mutate: printQuotation, isPending: isPrintPending } = useMutation({
    mutationFn: async () => {
      const templates = await api.core.template.findAll({
        filter: 'templateType.code||$eq||quotation'
      });
      if (!templates || templates.length === 0) {
        throw new Error('No quotation template found. Please create one in Content Management.');
      }
      const template = templates[0];
      if (!template.documentId) {
        throw new Error('The quotation template does not have a PDF document attached.');
      }

      const file = await api.core.storage.getFileById(template.documentId);
      const letterheadBuffer = await file.arrayBuffer();

      const q = workflow?.quotation;

      const [systemEnterpriseLogoUrl, clientLogoUrl] = await Promise.all([
        loadLogoAsBase64(q?.systemEnterprise),
        loadLogoAsBase64(q?.enterprise)
      ]);

      const inputMapping = buildQuotationPdfInputMapping(
        q,
        tCountry,
        systemEnterpriseLogoUrl,
        clientLogoUrl
      );

      const pdf = await generatePdfDocument({
        templateVariables: template.variables as Record<string, any> | undefined,
        letterheadBuffer,
        inputMapping,
        articles: q?.quotationArticles || []
      });

      openPdfInNewTab(pdf);
    },
    onSuccess: () => {
      toast.success(tInvoicing('quotation.messages.print_success', 'Quotation PDF generated successfully'));
    },
    onError: (error: Error) => {
      toast.error(
        error.message || tInvoicing('quotation.messages.print_failed', 'Failed to generate quotation PDF')
      );
    }
  });

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
        disabled={!workflow?.isPrintable || isNextPending || isPrintPending}
        onClick={() => printQuotation()}>
        <Printer />
        <span>
          {isPrintPending ? t('commands.printing') || 'Printing...' : t('commands.print')}
        </span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.quotation?.id || isDuplicatePending || isNextPending}
        onClick={() => duplicateQuotation()}>
        <Copy />
        <span>
          {isDuplicatePending
            ? t('commands.duplicating', 'Duplicating...')
            : t('commands.duplicate', 'Duplicate')}
        </span>
      </Button>
      {workflow?.nextSteps.map((step) => (
        <Button
          key={step.label}
          variant={'outline'}
          className="w-full"
          disabled={isNextPending}
          onClick={() => handleNext(step.label)}>
          {tInvoicing(
            `quotation.actions.${step.label.toLowerCase().replace(/ /g, '_')}`,
            step.label
          )}
        </Button>
      ))}

      {workflow?.quotation?.status === 'Invoiced' && (
        <Button
          variant={'outline'}
          className="w-full"
          disabled={isCreateInvoicePending}
          onClick={() => setIsAdditionalInvoiceDialogOpen(true)}>
          {tInvoicing('quotation.invoice_dialog.create_additional', 'Create additional invoice')}
        </Button>
      )}

      <Button
        variant={'ghost'}
        className="w-full"
        disabled={!workflow?.isUpdatable}
        onClick={reset}>
        <Repeat2 />
        <span>{t('commands.reset')}</span>
      </Button>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tInvoicing('quotation.invoice_dialog.title', 'Create Invoice')}</DialogTitle>
            <DialogDescription>
              {tInvoicing(
                'quotation.invoice_dialog.description',
                'Do you want to create an invoice using the information of the quotation?'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isCreateInvoicePending || isNextPending}
              onClick={() => {
                setIsInvoiceDialogOpen(false);
                next('To Invoice');
              }}>
              {tInvoicing('quotation.invoice_dialog.no', 'No, just update status')}
            </Button>
            <Button
              disabled={isCreateInvoicePending || isNextPending}
              onClick={() => {
                handleCreateInvoiceAndUpdateStatus();
              }}>
              {tInvoicing('quotation.invoice_dialog.yes', 'Yes, create invoice')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdditionalInvoiceDialogOpen} onOpenChange={setIsAdditionalInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tInvoicing('quotation.invoice_dialog.title', 'Create Invoice')}</DialogTitle>
            <DialogDescription>
              {tInvoicing(
                'quotation.invoice_dialog.create_additional_description',
                'Are you sure you want to create an additional invoice for this quotation?'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isCreateInvoicePending}
              onClick={() => setIsAdditionalInvoiceDialogOpen(false)}>
              {t('commands.cancel')}
            </Button>
            <Button
              disabled={isCreateInvoicePending}
              onClick={() => {
                setIsAdditionalInvoiceDialogOpen(false);
                handleCreateInvoice();
              }}>
              {tInvoicing('quotation.invoice_dialog.yes', 'Yes, create invoice')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
