import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_INVOICE_CONFIG = {
  version: 3,
  templateName: 'document',
  options: {
    includeHeader: true,
    includeFooter: true,
    includeLineItems: true,
    includeBankDetails: true,
    includeNotes: true,
    includeGeneralConditions: false,
    showPageNumbers: false
  }
};

const DEFAULT_QUOTATION_CONFIG = { ...DEFAULT_INVOICE_CONFIG };

export default function PdfTemplatePlaygroundPage() {
  const [docType, setDocType] = React.useState<'invoice' | 'quotation'>('invoice');

  const config =
    docType === 'quotation' ? DEFAULT_QUOTATION_CONFIG : DEFAULT_INVOICE_CONFIG;

  return (
    <div className="flex flex-col max-w-3xl p-6 gap-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FileText className="size-5" />
          PDF Templates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Document PDFs are rendered on the server using EJS templates and Puppeteer. Templates
          live in the API under <code className="text-xs">assets/templates/</code> and are
          referenced by name in template configuration.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm">
          To preview a template with real data, open a template in Content Management and use the
          PDF preview panel with a live invoice or quotation.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/content-management/templates">
            <ExternalLink className="size-4 mr-2" />
            Manage templates
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Document type</Label>
          <Select value={docType} onValueChange={(v) => setDocType(v as 'invoice' | 'quotation')}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="quotation">Quotation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label>Default template config (v3)</Label>
        <Textarea
          readOnly
          value={JSON.stringify(config, null, 2)}
          className="font-mono text-xs min-h-[280px]"
        />
      </div>
    </div>
  );
}
