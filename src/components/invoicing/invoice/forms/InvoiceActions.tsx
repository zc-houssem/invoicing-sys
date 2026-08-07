import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseInvoiceWorkflowDto } from '@/types/core/invoicing/invoice';
import { useMutation } from '@tanstack/react-query';
import { Copy, Printer, Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import {
  generatePdfDocument,
  openPdfInNewTab
} from '@/components/content-management/templates/pdfme/pdfGeneration';
import { loadLogoAsBase64 } from '@/components/content-management/templates/pdfme/pdfLogoLoader';
import { buildInvoicePdfInputMapping } from '@/components/invoicing/invoice/utils/invoicePdfInputMapping';

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
  const { t: tCountry } = useTranslation('countries');
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

      const file = await api.core.storage.getFileById(template.documentId);
      const letterheadBuffer = await file.arrayBuffer();

      const q = workflow?.invoice;

      const [systemEnterpriseLogoUrl, clientLogoUrl] = await Promise.all([
        loadLogoAsBase64(q?.systemEnterprise),
        loadLogoAsBase64(q?.enterprise)
      ]);

      const inputMapping = buildInvoicePdfInputMapping(
        q,
        tCountry,
        systemEnterpriseLogoUrl,
        clientLogoUrl
      );

      const pdf = await generatePdfDocument({
        templateVariables: template.variables as Record<string, any> | undefined,
        letterheadBuffer,
        inputMapping,
        articles: q?.invoiceArticles || []
      });

      openPdfInNewTab(pdf);
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
        disabled={isNextPending || isSavePending}
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
    </div>
  );
};
