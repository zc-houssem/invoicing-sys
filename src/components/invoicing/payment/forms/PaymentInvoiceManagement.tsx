import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInvoices } from '@/hooks/content/core/useInvoices';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/shared';

interface PaymentInvoiceManagementProps {
  className?: string;
  loading?: boolean;
}

export const PaymentInvoiceManagement = ({ className }: PaymentInvoiceManagementProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const store = usePaymentStore();

  const isUpdate = !!store.updateDto;
  const dto = store.updateDto || store.createDto;
  const invoicesList = dto.invoices || [];

  const enterpriseId = dto.enterpriseId;
  const currencyId = dto.currencyId;

  const { invoices: availableInvoices, isInvoicesPending } = useInvoices({
    enterpriseId,
    join: ['enterprise', 'currency', 'invoiceArticles', 'invoiceArticles.taxes', 'payments']
  });

  const handleRemoveInvoice = (index: number) => {
    const updated = invoicesList.filter((_, i) => i !== index);
    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  const handleAmountChange = (index: number, amountStr: string) => {
    const amountVal = parseFloat(amountStr) || 0;
    const updated = [...invoicesList];
    updated[index] = {
      ...updated[index],
      amount: amountVal
    };
    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  React.useEffect(() => {
    if (!isInvoicesPending && availableInvoices) {
      const eligible = availableInvoices.filter((inv) => {
        if (!inv?.status) return false;
        const s = String(inv.status)
          .toLowerCase()
          .replace(/[^a-z]/g, '');
        return s.includes('sent') || s.includes('partially') || s.includes('overdue');
      });

      if (!isUpdate) {
        // Only set if not already set or enterprise changed
        const newEntries = eligible.map((inv) => ({
          invoiceId: inv.id,
          amount: 0,
          invoice: inv
        }));
        store.setNested('createDto.invoices', newEntries);
      }
    }
  }, [availableInvoices, isInvoicesPending, enterpriseId, isUpdate]);

  if (!enterpriseId) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground h-24 text-center text-sm">
        {tInvoicing('payment.select_enterprise_first', {
          defaultValue: 'Please select an enterprise to manage invoices.'
        })}
      </div>
    );
  }

  if (isInvoicesPending) {
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );
  }

  return (
    <Card className={cn('w-full border-0 shadow-none p-4', className)}>
      <CardHeader className="p-0 pb-4 space-y-1 w-full flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">
            {tInvoicing('invoice.plural', { defaultValue: 'Invoices' })}
          </CardTitle>
          <CardDescription>
            {tInvoicing('payment.manage_invoice_allocations', {
              defaultValue: 'Allocate payment amounts to enterprise invoices.'
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 grid gap-3">
        {invoicesList.length === 0 ? (
          <div className="flex items-center justify-center gap-2 font-medium h-24 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
            {tInvoicing('payment.no_invoices', {
              defaultValue: 'No invoices available for this enterprise'
            })}{' '}
            <PackageOpen className="size-5" />
          </div>
        ) : (
          <div className="space-y-3">
            {invoicesList.map((entry, index) => {
              const selectedInvoice = entry.invoice || availableInvoices.find((inv) => inv.id === entry.invoiceId);

              const symbol = selectedInvoice?.currency?.extras?.symbol || '';
              const digits = Number(selectedInvoice?.currency?.extras?.digitsAfterComma ?? 3);
              const total = Number(selectedInvoice?.totalIncludingTaxes ?? (selectedInvoice as any)?.total ?? 0);
              const remaining = Number(selectedInvoice?.amountToPay ?? 0);

              let paid = 0;
              const paymentsArr = (selectedInvoice as any)?.payments;
              if (Array.isArray(paymentsArr) && paymentsArr.length > 0) {
                paid = paymentsArr.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);
              } else if (typeof (selectedInvoice as any)?.amountPaid === 'number') {
                paid = (selectedInvoice as any).amountPaid;
              } else if (total > remaining) {
                paid = total - remaining;
              }

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border rounded-lg bg-card">
                  <div className="flex-1 w-full">
                    <Label className="text-xs font-semibold mb-1 block text-muted-foreground">
                      {tInvoicing('invoice.singular', { defaultValue: 'Invoice' })}
                    </Label>
                    <div className="text-sm font-medium py-1.5 px-3 bg-muted/40 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        {selectedInvoice ? (
                          <>
                            <span className="font-bold">#{selectedInvoice.id}</span>
                            {selectedInvoice.object ? ` - ${selectedInvoice.object}` : ''}
                            {selectedInvoice.sequence ? ` (${selectedInvoice.sequence})` : ''}
                          </>
                        ) : (
                          `Invoice #${entry.invoiceId}`
                        )}
                      </div>
                      {selectedInvoice && (
                        <div className="flex items-center gap-3 text-xs shrink-0">
                          <span className="text-muted-foreground">
                            {tInvoicing('invoice.paid', { defaultValue: 'Paid' })}:{' '}
                            <strong className="text-emerald-600 font-semibold">{`${paid.toFixed(digits)} ${symbol}`}</strong>
                          </span>
                          <span className="text-muted-foreground">
                            {tInvoicing('invoice.remaining', { defaultValue: 'Remaining' })}:{' '}
                            <strong className="text-amber-600 font-semibold">{`${remaining.toFixed(digits)} ${symbol}`}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Label className="text-xs font-semibold mb-1 block">
                      {tInvoicing('payment.form.amount', { defaultValue: 'Allocated Amount' })}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      value={entry.amount || ''}
                      onChange={(e) => handleAmountChange(index, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="sm:pt-5 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveInvoice(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
