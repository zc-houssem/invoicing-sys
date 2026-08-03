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

  const dto = store.updateDto || store.createDto;
  const amountPaid = Number(dto.amount || 0);
  const fee = Number(dto.fee || 0);
  const available = amountPaid + fee;

  const used = React.useMemo(() => {
    return (dto.invoices || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [dto.invoices]);

  const remaining_amount = available - used;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <table className="w-full mt-2">
        <tbody>
          <tr>
            <td className="text-start">
              <Label className="text-xs font-thin">
                {tInvoicing('payment.financial_status.received', { defaultValue: 'Received Amount' })}
              </Label>
            </td>
            <td className="text-muted-foreground text-end text-xs">{available.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-start">
              <Label className="text-xs font-thin">
                {tInvoicing('payment.financial_status.used', { defaultValue: 'Used Amount' })}
              </Label>
            </td>
            <td className="text-muted-foreground text-end text-xs">{used.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-start">
              <Label className="text-xs font-thin">
                {tInvoicing('payment.financial_status.available', { defaultValue: 'Available Amount' })}
              </Label>
            </td>
            <td className="text-muted-foreground text-end text-xs">{remaining_amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
