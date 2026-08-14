import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PaymentDeleteDialogProps {
  representation?: string;
  deletePayment?: () => void;
  isDeletionPending?: boolean;
  resetPayment?: () => void;
}

export const usePaymentDeleteDialog = ({
  representation,
  deletePayment,
  isDeletionPending,
  resetPayment
}: PaymentDeleteDialogProps) => {
  const { t } = useTranslation('invoicing');

  const {
    DialogFragment: deletePaymentDialog,
    openDialog: openDeletePaymentDialog,
    closeDialog: closeDeletePaymentDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('payment.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('payment.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deletePayment?.();
              closeDeletePaymentDialog();
            }}>
            {t('payment.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              resetPayment?.();
              closeDeletePaymentDialog();
            }}>
            {t('payment.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: resetPayment
  });

  return {
    deletePaymentDialog,
    openDeletePaymentDialog,
    closeDeletePaymentDialog
  };
};
