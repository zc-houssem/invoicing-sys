import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/shared';
import { ResponseTemplateDto } from '@/types';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { createPdfBlobUrl, revokePdfBlobUrl } from '@/utils/pdf.utils';
import { getErrorMessage } from '@/utils/errors';
import { useFullScreen } from '@/hooks/useFullScreen';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';
import { Check, Expand, FileText, X } from 'lucide-react';

const PDF_PAGE_WIDTH = 794;
const PDF_PAGE_HEIGHT = 1123;

export interface PrintTemplateDialogContentProps {
  isOpen: boolean;
  documentType: 'invoice' | 'quotation';
  documentId?: number;
  templates: ResponseTemplateDto[];
  isLoading?: boolean;
  isPrinting?: boolean;
  onConfirm: (templateId: string) => void;
  onCancel: () => void;
  className?: string;
}

export const PrintTemplateDialogContent = ({
  isOpen,
  documentType,
  documentId,
  templates,
  isLoading,
  isPrinting,
  onConfirm,
  onCancel,
  className
}: PrintTemplateDialogContentProps) => {
  const { t } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const previewUrlRef = React.useRef<string | null>(null);

  const { isFullscreen, toggle: toggleFullscreen } = useFullScreen({
    onToggle(isFs) {
      if (isFs) {
        const hamburgerButton = document.getElementById('nav-toggler');
        if (hamburgerButton) hamburgerButton.style.display = 'none';
      } else {
        const hamburgerButton = document.getElementById('nav-toggler');
        if (hamburgerButton) hamburgerButton.style.display = '';
      }
    }
  });

  const titleKey =
    documentType === 'invoice'
      ? 'invoice.print_dialog.title'
      : 'quotation.print_dialog.title';
  const descriptionKey =
    documentType === 'invoice'
      ? 'invoice.print_dialog.description'
      : 'quotation.print_dialog.description';
  const dialogNs = `${documentType}.print_dialog`;

  const revokePreview = React.useCallback(() => {
    if (previewUrlRef.current) {
      revokePdfBlobUrl(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      revokePreview();
      setPreviewError(null);
      setIsPreviewLoading(false);
      setSelectedTemplateId('');
    }
  }, [isOpen, revokePreview]);

  React.useEffect(() => {
    if (isOpen || !isFullscreen) return;
    toggleFullscreen();
  }, [isOpen, isFullscreen, toggleFullscreen]);

  React.useEffect(() => {
    if (!isOpen || templates.length === 0) return;

    setSelectedTemplateId((current) => {
      if (current && templates.some((template) => template.id === current)) {
        return current;
      }
      return templates[0].id;
    });
  }, [isOpen, templates]);

  React.useEffect(() => {
    if (!isOpen || !selectedTemplateId || !documentId) {
      revokePreview();
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const blob =
          documentType === 'quotation'
            ? await api.core.documentPdf.previewWithQuotation(selectedTemplateId, documentId)
            : await api.core.documentPdf.previewWithInvoice(selectedTemplateId, documentId);

        if (cancelled) return;

        revokePreview();
        const url = createPdfBlobUrl(blob);
        previewUrlRef.current = url;
        setPreviewUrl(url);
      } catch (error) {
        if (cancelled) return;
        setPreviewError(
          getErrorMessage(
            'invoicing',
            error as Error,
            tInvoicing(`${dialogNs}.preview_error`)
          )
        );
      } finally {
        if (!cancelled) setIsPreviewLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, selectedTemplateId, documentId, documentType, revokePreview, tInvoicing, dialogNs]);

  React.useEffect(() => () => revokePreview(), [revokePreview]);

  const pdfEmbedParams = '#toolbar=0&navpanes=0&scrollbar=0';
  const pdfViewParams = isFullscreen ? `${pdfEmbedParams}&view=Fit` : `${pdfEmbedParams}&view=FitH`;

  const previewBody = !documentId ? (
    <div className="flex min-h-[320px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
      {tInvoicing(`${dialogNs}.preview_unavailable`)}
    </div>
  ) : previewError ? (
    <div className="flex min-h-[320px] items-center justify-center p-6 text-center text-sm text-destructive">
      {previewError}
    </div>
  ) : previewUrl ? (
    isFullscreen ? null : (
      <div className="flex justify-center p-4 min-w-max">
        <iframe
          title={tInvoicing(`${dialogNs}.preview`)}
          src={`${previewUrl}${pdfViewParams}`}
          className="shrink-0 border-0 bg-white shadow-md rounded-sm"
          style={{ width: PDF_PAGE_WIDTH, height: PDF_PAGE_HEIGHT }}
          scrolling="no"
        />
      </div>
    )
  ) : (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
      {tInvoicing(`${dialogNs}.preview_loading`)}
    </div>
  );

  const fullscreenOverlay =
    isFullscreen &&
    previewUrl &&
    typeof document !== 'undefined' &&
    createPortal(
      <div className="fixed inset-0 z-[9999] flex flex-col bg-background">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Label className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {tInvoicing(`${dialogNs}.preview`)}
            </Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger className="h-8 max-w-xs">
                <SelectValue placeholder={tInvoicing(`${dialogNs}.select_template`)} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={toggleFullscreen} className="shrink-0">
            <X className="mr-1.5 size-4" />
            {tInvoicing(`${dialogNs}.exit_fullscreen`)}
          </Button>
        </div>
        <div className="relative min-h-0 flex-1 bg-muted/20">
          {isPreviewLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <Spinner />
            </div>
          )}
          <iframe
            title={tInvoicing(`${dialogNs}.preview`)}
            src={`${previewUrl}${pdfEmbedParams}&view=Fit`}
            className="absolute inset-0 h-full w-full border-0 bg-white"
          />
        </div>
      </div>,
      document.body
    );

  const previewPanel = (
    <div className="relative flex min-h-[360px] flex-1 min-w-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {tInvoicing(`${dialogNs}.preview`)}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          disabled={!previewUrl}>
          <Expand className="mr-1.5 size-4" />
          {tInvoicing(`${dialogNs}.fullscreen`)}
        </Button>
      </div>
      <div className="relative min-h-0 flex-1 bg-muted/20">
        {isPreviewLoading && !isFullscreen && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner />
          </div>
        )}
        <ScrollAreaPrimitive.Root className="h-full max-h-[min(60vh,680px)] w-full overflow-hidden">
          <ScrollAreaPrimitive.Viewport className="h-full w-full">
            {previewBody}
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
      </div>
    </div>
  );

  return (
    <>
      {fullscreenOverlay}
      <div className={cn('flex max-h-[90vh] flex-col gap-0', className)}>
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{tInvoicing(titleKey)}</DialogTitle>
          <DialogDescription>{tInvoicing(descriptionKey)}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : templates.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">
            {tInvoicing(`${dialogNs}.no_templates`)}
          </p>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="flex flex-col border-b md:border-b-0 md:border-r">
              <div className="shrink-0 border-b px-4 py-3">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tInvoicing(`${dialogNs}.select_template`)}
                </Label>
              </div>
              <ScrollAreaPrimitive.Root className="max-h-[min(60vh,680px)] flex-1 overflow-hidden">
                <ScrollAreaPrimitive.Viewport className="h-full w-full">
                  <div className="flex flex-col gap-2 p-3">
                    {templates.map((template) => {
                      const isSelected = selectedTemplateId === template.id;
                      return (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={cn(
                            'group w-full rounded-lg border p-3 text-left transition-all',
                            'hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                              : 'border-border bg-card'
                          )}>
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/25 bg-muted/40 text-muted-foreground group-hover:border-primary/30'
                              )}>
                              {isSelected ? (
                                <Check className="size-4" strokeWidth={2.5} />
                              ) : (
                                <FileText className="size-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p
                                className={cn(
                                  'truncate text-sm font-medium leading-snug',
                                  isSelected && 'text-primary'
                                )}>
                                {template.name}
                              </p>
                              {template.description ? (
                                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                  {template.description}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar orientation="vertical" />
              </ScrollAreaPrimitive.Root>
            </div>

            {previewPanel}
          </div>
        )}

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isPrinting}>
            {t('commands.cancel')}
          </Button>
          <Button
            onClick={() => selectedTemplateId && onConfirm(selectedTemplateId)}
            disabled={!selectedTemplateId || isPrinting || isLoading || templates.length === 0}>
            {isPrinting ? t('commands.printing') : t('commands.print')}
          </Button>
        </DialogFooter>
      </div>
    </>
  );
};
