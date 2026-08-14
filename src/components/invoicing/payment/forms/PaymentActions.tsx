import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponsePaymentDto, PAYMENT_STATUS } from '@/types/core/invoicing/payment';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/api';

interface PaymentActionsProps {
  className?: string;
  payment: ResponsePaymentDto | null;
  save: () => void;
  reload: () => void;
  reset: () => void;
  isSaveDisabled?: boolean;
  isUpdatePending?: boolean;
}

export const PaymentActions = ({
  className,
  payment,
  save,
  reload,
  reset,
  isSaveDisabled,
  isUpdatePending
}: PaymentActionsProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const { mutate: updateStatus, isPending: isStatusPending } = useMutation({
    mutationFn: async (status: PAYMENT_STATUS) => {
      if (!payment?.id) return;
      return api.invoicing.payment.update(payment.id, { status });
    },
    onSuccess: () => {
      reload();
      toast.success(tInvoicing('payment.messages.status_updated', 'Payment status updated successfully'));
    },
    onError: (error) => {
      toast.error(tInvoicing('payment.messages.status_failed', 'Failed to update payment status'));
    }
  });

  const isPending = isUpdatePending || isStatusPending;
  const currentStatus = payment?.status;

  return (
    <div className={cn('flex flex-col gap-2 items-start justify-center w-full', className)}>
      <Button
        variant={'default'}
        className="w-full"
        disabled={isSaveDisabled || isPending}
        onClick={save}>
        <span>{tCommon('commands.save')}</span>
      </Button>

      {currentStatus === PAYMENT_STATUS.Draft && (
        <Button
          variant={'outline'}
          className="w-full"
          disabled={isPending}
          onClick={() => updateStatus(PAYMENT_STATUS.Validated)}>
          <span>{tInvoicing('payment.actions.validate', 'Validate')}</span>
        </Button>
      )}

      {(currentStatus === PAYMENT_STATUS.Draft || currentStatus === PAYMENT_STATUS.Validated) && (
        <Button
          variant={'outline'}
          className="w-full"
          disabled={isPending}
          onClick={() => updateStatus(PAYMENT_STATUS.Cancelled)}>
          <span>{tInvoicing('payment.actions.cancel', 'Cancel')}</span>
        </Button>
      )}

      {currentStatus === PAYMENT_STATUS.Cancelled && (
        <Button
          variant={'outline'}
          className="w-full"
          disabled={isPending}
          onClick={() => updateStatus(PAYMENT_STATUS.Draft)}>
          <span>{tInvoicing('payment.actions.back_to_draft', 'Back to draft')}</span>
        </Button>
      )}

      <Button
        variant={'ghost'}
        className="w-full"
        disabled={isPending}
        onClick={reset}>
        <span>{tCommon('commands.reset')}</span>
      </Button>
    </div>
  );
};
