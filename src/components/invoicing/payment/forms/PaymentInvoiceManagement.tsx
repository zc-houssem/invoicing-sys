import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { ExternalLink, FileText, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInvoices } from '@/hooks/content/core/useInvoices';
import { Spinner } from '@/components/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { CreatePaymentInvoiceEntryDto } from '@/types';
import { PaymentInvoiceItem } from './PaymentInvoiceItem';
import { getInvoiceAlreadyPaid } from './payment.utils';

interface PaymentInvoiceManagementProps {
  className?: string;
  loading?: boolean;
}

export const PaymentInvoiceManagement = ({ className }: PaymentInvoiceManagementProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCommon } = useTranslation('common');
  const store = usePaymentStore();

  const [previewInvoiceId, setPreviewInvoiceId] = React.useState<number | null>(null);

  const isUpdate = !!store.updateDto;
  const dto = store.updateDto || store.createDto;
  const invoicesList: CreatePaymentInvoiceEntryDto[] = dto.invoices || [];

  const enterpriseId = dto.enterpriseId;
  const totalPaymentAmount = Number(dto.amount || 0) + Number(dto.fee || 0);
  const currentPaymentId = store.response?.id;

  const { invoices: availableInvoices, isInvoicesPending } = useInvoices({
    enterpriseId,
    join: ['enterprise', 'currency', 'invoiceArticles', 'invoiceArticles.taxes', 'payments']
  });

  const sumAllocated = React.useMemo(() => {
    return invoicesList.reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0);
  }, [invoicesList]);

  const handleRemoveInvoice = (index: number) => {
    const updated = invoicesList.filter((_: any, i: number) => i !== index);
    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  const updateInvoiceAmount = (targetIndex: number, rawVal: number) => {
    if (!invoicesList[targetIndex]) return;

    const targetInvoice =
      availableInvoices.find((inv) => inv.id === invoicesList[targetIndex].invoiceId) ||
      invoicesList[targetIndex].invoice;

    const total = Number(targetInvoice?.totalIncludingTaxes ?? (targetInvoice as any)?.total ?? 0);
    const netToPay = Number(targetInvoice?.amountToPay ?? total);
    const alreadyPaid = getInvoiceAlreadyPaid(
      targetInvoice,
      currentPaymentId,
      store.response?.invoices,
      targetInvoice?.id
    );
    const alreadyRemaining = Math.max(0, netToPay - alreadyPaid);

    // Clamp value to invoice remaining balance and non-negative
    let newVal = Math.max(0, Math.min(rawVal, alreadyRemaining));

    const updatedList = invoicesList.map((entry) => ({ ...entry }));

    if (totalPaymentAmount > 0) {
      // Clamp newVal so it doesn't exceed total payment amount by itself
      newVal = Math.min(newVal, totalPaymentAmount);
      updatedList[targetIndex].amount = Number(newVal.toFixed(3));

      // Calculate sum of all allocated amounts
      let currentTotalAllocated = updatedList.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      // If total allocated exceeds total payment amount, make other sliders lose value!
      let excess = currentTotalAllocated - totalPaymentAmount;

      if (excess > 0.0001) {
        // Reduce excess from other entries starting from the last entry
        for (let i = updatedList.length - 1; i >= 0 && excess > 0.0001; i--) {
          if (i === targetIndex) continue;
          const currentAmount = Number(updatedList[i].amount || 0);
          if (currentAmount > 0) {
            const deduction = Math.min(currentAmount, excess);
            updatedList[i].amount = Number((currentAmount - deduction).toFixed(3));
            excess -= deduction;
          }
        }
      }
    } else {
      // If no total payment amount set yet, update this invoice allocation
      updatedList[targetIndex].amount = Number(newVal.toFixed(3));
      const newSum = updatedList.reduce(
        (sum: number, item: any) => sum + Number(item.amount || 0),
        0
      );
      const feeVal = Number(dto.fee || 0);
      const newAmount = Math.max(0, newSum - feeVal);
      if (isUpdate) {
        store.setNested('updateDto.amount', Number(newAmount.toFixed(3)));
      } else {
        store.setNested('createDto.amount', Number(newAmount.toFixed(3)));
      }
    }

    if (isUpdate) {
      store.setNested('updateDto.invoices', updatedList);
    } else {
      store.setNested('createDto.invoices', updatedList);
    }
  };

  const handleAutoAllocate = () => {
    let budget = totalPaymentAmount;
    if (budget <= 0) {
      // Auto-allocate full remaining balance for all invoices if budget not set
      const updated = invoicesList.map((entry) => {
        const inv = availableInvoices.find((i) => i.id === entry.invoiceId) || entry.invoice;
        const total = Number(inv?.totalIncludingTaxes ?? (inv as any)?.total ?? 0);
        const netToPay = Number(inv?.amountToPay ?? total);
        const alreadyPaid = getInvoiceAlreadyPaid(
          inv,
          currentPaymentId,
          store.response?.invoices,
          entry.invoiceId || inv?.id
        );
        const remaining = Math.max(0, netToPay - alreadyPaid);
        return { ...entry, amount: Number(remaining.toFixed(3)) };
      });
      const newTotal = updated.reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
      const feeVal = Number(dto.fee || 0);
      const newAmount = Math.max(0, newTotal - feeVal);
      if (isUpdate) {
        store.setNested('updateDto.amount', Number(newAmount.toFixed(3)));
        store.setNested('updateDto.invoices', updated);
      } else {
        store.setNested('createDto.amount', Number(newAmount.toFixed(3)));
        store.setNested('createDto.invoices', updated);
      }
      return;
    }

    const updated = invoicesList.map((entry) => {
      const inv = availableInvoices.find((i) => i.id === entry.invoiceId) || entry.invoice;
      const total = Number(inv?.totalIncludingTaxes ?? (inv as any)?.total ?? 0);
      const netToPay = Number(inv?.amountToPay ?? total);
      const alreadyPaid = getInvoiceAlreadyPaid(
        inv,
        currentPaymentId,
        store.response?.invoices,
        entry.invoiceId || inv?.id
      );
      const remaining = Math.max(0, netToPay - alreadyPaid);
      const allocated = Math.min(budget, remaining);
      budget = Math.max(0, budget - allocated);
      return { ...entry, amount: Number(allocated.toFixed(3)) };
    });

    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  const handleClearAllAllocations = () => {
    const updated = invoicesList.map((entry) => ({ ...entry, amount: 0 }));
    if (isUpdate) {
      store.setNested('updateDto.invoices', updated);
    } else {
      store.setNested('createDto.invoices', updated);
    }
  };

  const prevEnterpriseIdRef = React.useRef<number | undefined>(enterpriseId);

  React.useEffect(() => {
    if (!isInvoicesPending && availableInvoices) {
      const eligible = availableInvoices.filter((inv) => {
        if (!inv?.status) return false;
        const s = String(inv.status)
          .toLowerCase()
          .replace(/[^a-z]/g, '');
        return s !== 'paid' && s !== 'draft';
      });

      const enterpriseChanged =
        prevEnterpriseIdRef.current !== undefined && prevEnterpriseIdRef.current !== enterpriseId;
      prevEnterpriseIdRef.current = enterpriseId;

      if (!isUpdate || enterpriseChanged) {
        const newEntries = eligible.map((inv) => ({
          invoiceId: inv.id,
          amount: 0,
          invoice: inv
        }));
        if (isUpdate) {
          store.setNested('updateDto.invoices', newEntries);
        } else {
          store.setNested('createDto.invoices', newEntries);
        }
      }
    }
  }, [availableInvoices, isInvoicesPending, enterpriseId, isUpdate]);

  if (!enterpriseId) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground h-24 text-center text-sm border border-dashed rounded-xl bg-card/50">
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

  const firstInv = availableInvoices?.[0] || invoicesList[0]?.invoice;
  const symbol = firstInv?.currency?.extras?.symbol || '';
  const digits = Number(firstInv?.currency?.extras?.digitsAfterComma ?? 3);
  const remainingBudget = Math.max(0, totalPaymentAmount - sumAllocated);

  return (
    <div className={cn('w-full space-y-3', className)}>
      {invoicesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/40">
          <PackageOpen className="size-8 stroke-1 text-muted-foreground/60" />
          <p className="font-medium">
            {tInvoicing('payment.no_invoices', {
              defaultValue: 'No unpaid invoices available for this enterprise'
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoicesList.map((entry, index) => (
            <PaymentInvoiceItem
              key={entry.invoiceId || index}
              entry={entry}
              index={index}
              availableInvoices={availableInvoices}
              defaultSymbol={symbol}
              defaultDigits={digits}
              totalPaymentAmount={totalPaymentAmount}
              remainingBudget={remainingBudget}
              onRemove={handleRemoveInvoice}
              onPreview={setPreviewInvoiceId}
              onUpdateAmount={updateInvoiceAmount}
            />
          ))}
        </div>
      )}

      {/* Invoice Iframe Dialog */}
      <Dialog open={!!previewInvoiceId} onOpenChange={(open) => !open && setPreviewInvoiceId(null)}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] max-h-[92vh] p-0 flex flex-col gap-0 overflow-hidden sm:rounded-xl">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between shrink-0 bg-card">
            <div>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                {tInvoicing('invoice.singular', { defaultValue: 'Invoice' })} #{previewInvoiceId}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {tInvoicing('invoice.preview_description', {
                  defaultValue: 'Live preview of invoice'
                })}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 pr-6">
              <a
                href={`/selling/invoices/${previewInvoiceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                <ExternalLink className="size-3.5" />
                {tCommon('commands.open_new_tab', { defaultValue: 'Open in new tab' })}
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 w-full bg-muted/10 relative overflow-hidden">
            {previewInvoiceId && (
              <iframe
                src={`/selling/invoices/${previewInvoiceId}?embed=true`}
                className="w-full h-full border-0"
                title={`Invoice ${previewInvoiceId}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

