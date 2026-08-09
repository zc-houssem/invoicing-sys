import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Spinner } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Expand, ExternalLink, RefreshCw, X } from 'lucide-react';
import { createPdfBlobUrl, openPdfBlob, revokePdfBlobUrl } from '@/utils/pdf.utils';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useFullScreen } from '@/hooks/useFullScreen';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';

/** A4 page height at ~794px width (96dpi) */
const PDF_PAGE_WIDTH = 794;
const PDF_PAGE_HEIGHT = 1123;

interface TemplatePdfPreviewProps {
  className?: string;
  templateId: string;
  templateTypeCode?: string;
}

export const TemplatePdfPreview = ({
  className,
  templateId,
  templateTypeCode
}: TemplatePdfPreviewProps) => {
  const isQuotation = templateTypeCode === 'quotation';
  const isInvoice = templateTypeCode === 'invoice';

  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string>('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const previewUrlRef = React.useRef<string | null>(null);

  const { isFullscreen, toggle: toggleFullscreen } = useFullScreen({
    onToggle(isFs) {
      const hamburgerButton = document.getElementById('nav-toggler');
      if (hamburgerButton) hamburgerButton.style.display = isFs ? 'none' : '';
    }
  });

  const revokeCurrentPreview = React.useCallback(() => {
    if (previewUrlRef.current) {
      revokePdfBlobUrl(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const { data: quotations, isPending: isQuotationsPending } = useQuery({
    queryKey: ['template-preview-quotations'],
    queryFn: () =>
      api.invoicing.quotation.findPaginated({
        limit: '50',
        sort: 'id,desc',
        join: 'enterprise'
      }),
    enabled: isQuotation
  });

  const { data: invoices, isPending: isInvoicesPending } = useQuery({
    queryKey: ['template-preview-invoices'],
    queryFn: () =>
      api.invoicing.invoice.findPaginated({
        limit: '50',
        sort: 'id,desc',
        join: 'enterprise'
      }),
    enabled: isInvoice
  });

  const documents = isQuotation ? quotations?.data : isInvoice ? invoices?.data : [];
  const isDocumentsPending = isQuotation ? isQuotationsPending : isInvoicesPending;

  React.useEffect(() => {
    setSelectedDocumentId('');
    setPreviewUrl(null);
    setPreviewError(null);
    revokeCurrentPreview();
  }, [templateId, templateTypeCode, revokeCurrentPreview]);

  React.useEffect(() => {
    return () => revokeCurrentPreview();
  }, [revokeCurrentPreview]);

  const generatePreview = React.useCallback(async () => {
    if (!selectedDocumentId) return;

    setIsGenerating(true);
    setPreviewError(null);

    try {
      const docId = parseInt(selectedDocumentId, 10);
      const blob = isQuotation
        ? await api.core.documentPdf.previewWithQuotation(templateId, docId)
        : await api.core.documentPdf.previewWithInvoice(templateId, docId);

      revokeCurrentPreview();
      const url = createPdfBlobUrl(blob);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    } catch (error) {
      setPreviewError(getErrorMessage('content-management', error, 'Failed to generate preview'));
      toast.error('Failed to generate PDF preview');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDocumentId, isQuotation, templateId, revokeCurrentPreview]);

  React.useEffect(() => {
    if (!selectedDocumentId) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsGenerating(true);
      setPreviewError(null);

      try {
        const docId = parseInt(selectedDocumentId, 10);
        const blob = isQuotation
          ? await api.core.documentPdf.previewWithQuotation(templateId, docId)
          : await api.core.documentPdf.previewWithInvoice(templateId, docId);

        if (cancelled) return;

        revokeCurrentPreview();
        const url = createPdfBlobUrl(blob);
        previewUrlRef.current = url;
        setPreviewUrl(url);
      } catch (error) {
        if (cancelled) return;
        setPreviewError(getErrorMessage('content-management', error, 'Failed to generate preview'));
        toast.error('Failed to generate PDF preview');
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedDocumentId, templateId, isQuotation, isInvoice, revokeCurrentPreview]);

  if (!isQuotation && !isInvoice) {
    return (
      <div className={cn('text-sm text-muted-foreground p-4', className)}>
        PDF preview is available for invoice and quotation templates only.
      </div>
    );
  }

  const documentLabel = isQuotation ? 'Quotation' : 'Invoice';

  const previewContent = !selectedDocumentId ? (
    <div className="flex min-h-[360px] items-center justify-center text-sm text-muted-foreground p-4 text-center">
      Select a {documentLabel.toLowerCase()} above to see how this template renders.
    </div>
  ) : previewError ? (
    <div className="flex min-h-[360px] items-center justify-center text-sm text-destructive p-4 text-center">
      {previewError}
    </div>
  ) : previewUrl ? (
    <div className="flex justify-center p-4 min-w-max">
      <iframe
        title="Template PDF Preview"
        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        className="shrink-0 border-0 bg-white shadow-md rounded-sm"
        style={{ width: PDF_PAGE_WIDTH, height: PDF_PAGE_HEIGHT }}
        scrolling="no"
      />
    </div>
  ) : (
    <div className="flex min-h-[360px] items-center justify-center text-sm text-muted-foreground">
      Generating preview…
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3 bg-background transition-all duration-300 ease-in-out',
        isFullscreen
          ? 'fixed inset-0 z-50 p-4 animate-in fade-in zoom-in-95'
          : 'h-full min-h-[420px]',
        className
      )}>
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <Label>Select a {documentLabel.toLowerCase()} to preview</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="shrink-0">
            {isFullscreen ? (
              <>
                <X className="size-4 mr-1" />
                Exit fullscreen
              </>
            ) : (
              <>
                <Expand className="size-4 mr-1" />
                Fullscreen
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedDocumentId}
            onValueChange={setSelectedDocumentId}
            disabled={isDocumentsPending}>
            <SelectTrigger className="flex-1">
              <SelectValue
                placeholder={
                  isDocumentsPending
                    ? `Loading ${documentLabel.toLowerCase()}s…`
                    : `Choose a ${documentLabel.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {documents?.map(
                (doc: {
                  id: number;
                  sequence?: string;
                  object?: string;
                  enterprise?: { name?: string };
                }) => (
                  <SelectItem key={doc.id} value={doc.id.toString()}>
                    {doc.sequence || `#${doc.id}`}
                    {doc.enterprise?.name ? ` — ${doc.enterprise.name}` : ''}
                    {doc.object ? ` (${doc.object})` : ''}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!selectedDocumentId || isGenerating}
            onClick={generatePreview}
            title="Refresh preview">
            <RefreshCw className={cn('size-4', isGenerating && 'animate-spin')} />
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!previewUrl}
            onClick={async () => {
              if (!selectedDocumentId) return;
              try {
                const docId = parseInt(selectedDocumentId, 10);
                const blob = isQuotation
                  ? await api.core.documentPdf.previewWithQuotation(templateId, docId)
                  : await api.core.documentPdf.previewWithInvoice(templateId, docId);
                openPdfBlob(blob);
              } catch {
                toast.error('Failed to open PDF');
              }
            }}>
            <ExternalLink className="size-4 mr-2" />
            Open
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Preview uses this template&apos;s layout with real {documentLabel.toLowerCase()} data
          generated on the server.
        </p>
      </div>

      <div className="relative flex-1 min-h-0 rounded-lg border bg-muted/30 overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner />
          </div>
        )}
        <ScrollAreaPrimitive.Root className="relative h-full w-full overflow-hidden">
          <ScrollAreaPrimitive.Viewport className="h-full w-full">
            {previewContent}
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
      </div>
    </div>
  );
};
