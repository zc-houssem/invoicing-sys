import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CreatePaymentInvoiceEntryDto, ResponseInvoiceDto } from '@/types';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { getInvoiceAlreadyPaid } from './payment.utils';

interface PaymentInvoiceItemProps {
  entry: CreatePaymentInvoiceEntryDto;
  index: number;
  availableInvoices: ResponseInvoiceDto[];
  defaultSymbol: string;
  defaultDigits: number;
  totalPaymentAmount: number;
  remainingBudget: number;
  onRemove: (index: number) => void;
  onPreview: (invoiceId: number) => void;
  onUpdateAmount: (index: number, amount: number) => void;
}

export const PaymentInvoiceItem = ({
  entry,
  index,
  availableInvoices,
  defaultSymbol,
  defaultDigits,
  totalPaymentAmount,
  remainingBudget,
  onRemove,
  onPreview,
  onUpdateAmount
}: PaymentInvoiceItemProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const store = usePaymentStore();
  const currentPaymentId = store.response?.id;

  const realInvoice = availableInvoices.find((inv) => inv.id === entry.invoiceId);
  const selectedInvoice = realInvoice || entry.invoice;

  const invSymbol = selectedInvoice?.currency?.extras?.symbol || defaultSymbol;
  const invDigits = Number(selectedInvoice?.currency?.extras?.digitsAfterComma ?? defaultDigits);
  const total = Number(
    selectedInvoice?.totalIncludingTaxes ?? (selectedInvoice as any)?.total ?? 0
  );
  const netToPay = Number(selectedInvoice?.amountToPay ?? total);

  const alreadyPaid = getInvoiceAlreadyPaid(
    selectedInvoice,
    currentPaymentId,
    store.response?.invoices,
    entry.invoiceId || selectedInvoice?.id
  );
  const alreadyRemaining = Math.max(0, netToPay - alreadyPaid);
  const currentAllocated = Number(entry.amount || 0);
  const newRemaining = Math.max(0, alreadyRemaining - currentAllocated);

  // Calculate max range for this slider
  // If total payment is specified, max is min(invoice remaining, allocated + unallocated remaining budget)
  const maxVal =
    totalPaymentAmount > 0
      ? Math.min(alreadyRemaining, currentAllocated + remainingBudget)
      : alreadyRemaining;

  return (
    <div className="relative group flex flex-col gap-3.5 p-4 rounded-xl border bg-card hover:border-primary/30 transition-all shadow-xs">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
        onClick={() => onRemove(index)}>
        <X className="size-4" />
      </Button>

      <div className="flex flex-col gap-1 pr-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(selectedInvoice?.id || entry.invoiceId)}
            className="font-bold text-sm text-foreground hover:text-primary hover:underline underline-offset-4 cursor-pointer transition-colors tracking-tight text-left">
            {selectedInvoice?.sequence}
          </button>
          {selectedInvoice?.object && (
            <span className="text-xs text-muted-foreground truncate max-w-55 sm:max-w-80">
              • {selectedInvoice.object}
            </span>
          )}
          {selectedInvoice?.status && (
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 font-medium border-primary/20 bg-primary/5">
              {String(
                tInvoicing(`invoice.status.${selectedInvoice.status}`, {
                  defaultValue: selectedInvoice.status
                })
              )}
            </Badge>
          )}
        </div>

        {selectedInvoice && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="text-xs text-muted-foreground">
              <span>Total: </span>
              <span className="text-foreground">{`${total.toFixed(invDigits)} ${invSymbol}`}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-muted/40 border border-border/40 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs text-muted-foreground font-normal">
                    {tInvoicing('payment.invoice_item.already_paid', {
                      defaultValue: 'Total of previous payments'
                    })}
                    :
                  </span>
                </div>
                <span className="text-xs text-foreground font-normal">{`${alreadyPaid.toFixed(invDigits)} ${invSymbol}`}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs text-muted-foreground font-normal">
                    {tInvoicing('payment.invoice_item.already_remaining', {
                      defaultValue: 'Balance due before operation'
                    })}
                    :
                  </span>
                </div>
                <span className="text-xs text-foreground font-normal">{`${alreadyRemaining.toFixed(invDigits)} ${invSymbol}`}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-xs text-muted-foreground font-normal">
                    {tInvoicing('payment.invoice_item.new_paid', {
                      defaultValue: 'Entered payment amount'
                    })}
                    :
                  </span>
                </div>
                <span className="text-xs text-foreground font-normal">{`${currentAllocated.toFixed(invDigits)} ${invSymbol}`}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-xs text-muted-foreground font-normal">
                    {tInvoicing('payment.invoice_item.new_remaining', {
                      defaultValue: 'New balance due'
                    })}
                    :
                  </span>
                </div>
                <span className="text-xs text-foreground font-normal">{`${newRemaining.toFixed(invDigits)} ${invSymbol}`}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slider and Amount Allocation Control */}
      <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center gap-3 pt-3 border-t border-border/50">
        <div className="flex-1 flex items-center gap-3">
          <Slider
            value={[currentAllocated]}
            min={0}
            max={maxVal > 0 ? maxVal : 1}
            step={0.01}
            disabled={maxVal <= 0}
            onValueChange={([val]) => onUpdateAmount(index, val)}
            className="flex-1 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={0}
              max={alreadyRemaining}
              step="any"
              value={currentAllocated || ''}
              onChange={(e) => onUpdateAmount(index, parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
            {invSymbol && (
              <span className="text-xs text-muted-foreground font-medium shrink-0">
                {invSymbol}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateAmount(index, maxVal)}>
            Max
          </Button>
        </div>
      </div>
    </div>
  );
};
