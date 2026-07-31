import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PaymentFinancialInformationProps {
  className?: string;
  loading?: boolean;
}

export const PaymentFinancialInformation = ({
  className,
  loading
}: PaymentFinancialInformationProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const store = usePaymentStore();

  const amountPaid = store.createDto.amount || 0;
  const fee = store.createDto.fee || 0;
  const available = amountPaid + fee;

  // Placeholder for used amount until invoices logic is fully integrated
  const used = 0; 
  const remaining_amount = available - used;

  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.received')}</Label>
          <Label className="ml-auto">
            {available.toFixed(2)}
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-full mt-1">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.used')}</Label>
          <Label className="ml-auto">
            {used.toFixed(2)}
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-full border-t pt-1">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.available')}</Label>
          <Label className="ml-auto">
            {remaining_amount.toFixed(2)}
          </Label>
        </div>
      </div>
    </div>
  );
};
