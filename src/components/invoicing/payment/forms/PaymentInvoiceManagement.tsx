import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvoices } from '@/hooks/content/core/useInvoices';
import { ResponseInvoiceDto } from '@/types/core/invoicing/invoice';
import { Label } from '@/components/ui/label';

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
    currencyId,
    join: ['enterprise', 'currency']
  });

  const handleAddInvoice = () => {
    const unallocated = availableInvoices.find(
      (inv) => !invoicesList.some((entry) => entry.invoiceId === inv.id)
    );
    if (!unallocated) return;

    const newEntries = [
      ...invoicesList,
      {
        invoiceId: unallocated.id,
        amount: 0
      }
    ];

    if (isUpdate) {
      store.setNested('updateDto.invoices', newEntries);
    } else {
      store.setNested('createDto.invoices', newEntries);
    }
  };

  const handleRemoveInvoice = (index: number) => {
    const updated = invoicesList.filter((_, i) => i !== index);
    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  const handleInvoiceChange = (index: number, newInvoiceId: number) => {
    const updated = [...invoicesList];
    updated[index] = {
      ...updated[index],
      invoiceId: newInvoiceId
    };
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

  if (!enterpriseId) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground h-24 text-center text-sm">
        {tInvoicing('payment.select_enterprise_first', {
          defaultValue: 'Please select an enterprise to manage invoices.'
        })}
      </div>
    );
  }

  return (
    <Card className={cn('w-full border-0 shadow-none', className)}>
      <CardHeader className="p-0 pb-4 space-y-1 w-full flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">{tInvoicing('invoice.plural', { defaultValue: 'Invoices' })}</CardTitle>
          <CardDescription>
            {tInvoicing('payment.manage_invoice_allocations', {
              defaultValue: 'Allocate payment amounts to enterprise invoices.'
            })}
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddInvoice}
          disabled={isInvoicesPending || availableInvoices.length === 0}
        >
          <Plus className="size-4 mr-1" />
          {tInvoicing('payment.add_invoice', { defaultValue: 'Add Invoice' })}
        </Button>
      </CardHeader>
      <CardContent className="p-0 grid gap-3">
        {invoicesList.length === 0 ? (
          <div className="flex items-center justify-center gap-2 font-medium h-24 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
            {tInvoicing('payment.no_invoices', { defaultValue: 'No invoices added yet' })} <PackageOpen className="size-5" />
          </div>
        ) : (
          <div className="space-y-3">
            {invoicesList.map((entry, index) => {
              const selectedInvoice = availableInvoices.find((inv) => inv.id === entry.invoiceId);
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1 w-full">
                    <Label className="text-xs font-semibold mb-1 block">
                      {tInvoicing('invoice.singular', { defaultValue: 'Invoice' })}
                    </Label>
                    <Select
                      value={entry.invoiceId ? String(entry.invoiceId) : ''}
                      onValueChange={(val) => handleInvoiceChange(index, Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={tInvoicing('invoice.form.placeholders.object', { defaultValue: 'Select invoice' })} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInvoices.map((inv: ResponseInvoiceDto) => {
                          const isSelectedElsewhere = invoicesList.some(
                            (e, i) => i !== index && e.invoiceId === inv.id
                          );
                          return (
                            <SelectItem
                              key={inv.id}
                              value={String(inv.id)}
                              disabled={isSelectedElsewhere}
                            >
                              #{inv.id} - {inv.object} ({inv.sequence || 'No ref'})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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
                      onClick={() => handleRemoveInvoice(index)}
                    >
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
