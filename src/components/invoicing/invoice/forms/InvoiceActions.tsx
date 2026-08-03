import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseInvoiceWorkflowDto } from '@/types/core/invoicing/invoice';
import { useMutation } from '@tanstack/react-query';
import { Copy, Printer, Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

interface InvoiceActionsProps {
  className?: string;
  workflow: ResponseInvoiceWorkflowDto | null;
  save: () => void;
  reload: () => void;
  reset: () => void;
}

export const InvoiceActions = ({
  className,
  workflow,
  save,
  reload,
  reset
}: InvoiceActionsProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

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
    mutationFn: async () => {
      const templates = await api.core.template.findAll({
        filter: 'templateType.code||$eq||invoice'
      });
      if (!templates || templates.length === 0) {
        throw new Error('No invoice template found. Please create one in Content Management.');
      }
      const template = templates[0];
      if (!template.documentId) {
        throw new Error('The invoice template does not have a PDF document attached.');
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

      const q = workflow?.invoice;
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
                const articles = q?.invoiceArticles || [];
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
      toast.success('Invoice PDF generated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate invoice PDF');
    }
  });

  return (
    <div className={cn('flex flex-col gap-2 items-start justify-center w-full', className)}>
      <Button
        variant={'default'}
        className="w-full"
        disabled={!workflow?.isUpdatable || isNextPending}
        onClick={save}>
        <Save />
        <span>{t('commands.save')}</span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.isPrintable || isNextPending || isPrintPending}
        onClick={() => printInvoice()}>
        <Printer />
        <span>
          {isPrintPending ? t('commands.printing') || 'Printing...' : t('commands.print')}
        </span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.invoice?.id || isDuplicatePending || isNextPending}
        onClick={() => duplicateInvoice()}>
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
          onClick={() => next(step.label)}>
          {step.label}
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
    </div>
  );
};
