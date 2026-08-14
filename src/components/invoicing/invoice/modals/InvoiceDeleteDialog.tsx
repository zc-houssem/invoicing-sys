import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface InvoiceDeleteDialogProps {
  representation?: string;
  deleteInvoice?: () => void;
  isDeletionPending?: boolean;
  resetInvoice?: () => void;
}

export const useInvoiceDeleteDialog = ({
  representation,
  deleteInvoice,
  isDeletionPending,
  resetInvoice
}: InvoiceDeleteDialogProps) => {
  const { t } = useTranslation('invoicing');

  const {
    DialogFragment: deleteInvoiceDialog,
    openDialog: openDeleteInvoiceDialog,
    closeDialog: closeDeleteInvoiceDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('invoice.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('invoice.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteInvoice?.();
              closeDeleteInvoiceDialog();
            }}>
            {t('invoice.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              resetInvoice?.();
              closeDeleteInvoiceDialog();
            }}>
            {t('invoice.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: resetInvoice
  });

  return {
    deleteInvoiceDialog,
    openDeleteInvoiceDialog,
    closeDeleteInvoiceDialog
  };
};
