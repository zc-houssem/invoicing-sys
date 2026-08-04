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
  const router = useRouter();
  const invoiceStore = useInvoiceStore();
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = React.useState(false);

  const { mutate: next, isPending: isNextPending } = useMutation({
    mutationFn: async (event: string) =>
      api.invoicing.quotation.workflow.next(workflow?.quotation?.id!, event),
    onSuccess: () => {
      reload();
      toast.success(
        t('quotation.messages.status_updated', 'Quotation status updated successfully')
      );
    }
  });

  const { mutate: duplicateQuotation, isPending: isDuplicatePending } = useMutation({
    mutationFn: async () => api.invoicing.quotation.duplicate(workflow?.quotation?.id!),
    onSuccess: (data) => {
      toast.success(t('quotation.messages.duplicate_success', 'Quotation duplicated successfully'));
      router.push(`/selling/quotations/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('quotation.messages.duplicate_failed', 'Failed to duplicate quotation'));
    }
  });

  const { mutate: createInvoice, isPending: isCreateInvoicePending } = useMutation({
    mutationFn: async (id: number) => api.invoicing.invoice.fromQuotation(id),
    onSuccess: (data) => {
      toast.success(t('quotation.messages.invoice_created', 'Invoice created successfully'));
      router.push(`/selling/invoices/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t('quotation.messages.invoice_failed', 'Failed to create invoice')
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

      const { generate } = await import('@pdfme/generator');
      const { text, image, date, table } = await import('@pdfme/schemas');

      // Fetch the base PDF file from storage
      const file = await api.core.storage.getFileById(template.documentId);
      const basePdf = await file.arrayBuffer();

      // Build the pdfme template from stored variables
      const pdfTemplate = template.variables
        ? {
            basePdf,
            ...(template.variables as object)
          }
        : {
            basePdf,
            schemas: [[]]
          };

      const q = workflow?.quotation;
      const inputMapping: Record<string, string> = {
        object: q?.object || '',
        date: q?.date ? new Date(q.date).toLocaleDateString() : '',
        dueDate: q?.dueDate ? new Date(q.dueDate).toLocaleDateString() : '',
        status: q?.status || '',
        generalConditions: q?.generalConditions || '',
        notes: q?.notes || '',
        enterpriseName: q?.enterprise?.name || '',
        enterpriseEmail: '',
        enterprisePhone: q?.enterprise?.phone || '',
        interlocutorName:
          `${q?.interlocutor?.firstName || ''} ${q?.interlocutor?.lastName || ''}`.trim(),
        interlocutorEmail: q?.interlocutor?.email || '',
        interlocutorPhone: q?.interlocutor?.phone || ''
      };

      // Generate inputs from the template schemas
      const schemas = (pdfTemplate as any).schemas || [[]];
      const inputs = schemas.map((pageSchemas: any[]) => {
        const pageInput: Record<string, any> = {};
        if (Array.isArray(pageSchemas)) {
          pageSchemas.forEach((field: any) => {
            if (field.name) {
              if (field.type === 'table') {
                const articles = q?.quotationArticles || [];
                const tableData = articles.map((a) => [
                  a.article?.title || '',
                  a.quantity?.toString() || '0',
                  a.unitPrice?.toString() || '0',
                  ((a.quantity || 0) * (a.unitPrice || 0)).toString()
                ]);
                // If table is empty, provide empty row so pdfme doesn't error
                pageInput[field.name] = tableData.length > 0 ? tableData : [['', '', '', '']];
              } else {
                pageInput[field.name] = inputMapping[field.name] ?? field.content ?? '';
              }
            }
          });
        }
        return pageInput;
      });

      const pdf = await generate({
        template: pdfTemplate as any,
        inputs: inputs.length > 0 ? inputs : [{}],
        plugins: { text, image, date, table }
      });

      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    },
    onSuccess: () => {
      toast.success(t('quotation.messages.print_success', 'Quotation PDF generated successfully'));
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t('quotation.messages.print_failed', 'Failed to generate quotation PDF')
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
          {tInvoicing(`quotation.actions.${step.label.toLowerCase().replace(/ /g, '_')}`, step.label)}
        </Button>
      ))}

      {workflow?.quotation?.status === 'Invoiced' && (
        <Button
          variant={'outline'}
          className="w-full"
          disabled={isCreateInvoicePending}
          onClick={() => handleCreateInvoice()}>
          {t('quotation.invoice_dialog.create_additional', 'Create additional invoice')}
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
            <DialogTitle>{t('quotation.invoice_dialog.title', 'Create Invoice')}</DialogTitle>
            <DialogDescription>
              {t(
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
              {t('quotation.invoice_dialog.no', 'No, just update status')}
            </Button>
            <Button
              disabled={isCreateInvoicePending || isNextPending}
              onClick={() => {
                handleCreateInvoiceAndUpdateStatus();
              }}>
              {t('quotation.invoice_dialog.yes', 'Yes, create invoice')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
