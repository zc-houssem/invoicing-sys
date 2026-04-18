import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface QuotationDeleteDialogProps {
  representation?: string;
  deleteQuotation?: () => void;
  isDeletionPending?: boolean;
  resetQuotation?: () => void;
}

export const useQuotationDeleteDialog = ({
  representation,
  deleteQuotation,
  isDeletionPending,
  resetQuotation
}: QuotationDeleteDialogProps) => {
  const { t } = useTranslation('invoicing');

  const {
    DialogFragment: deleteQuotationDialog,
    openDialog: openDeleteQuotationDialog,
    closeDialog: closeDeleteQuotationDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('quotation.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('quotation.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteQuotation?.();
              closeDeleteQuotationDialog();
            }}>
            {t('quotation.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              resetQuotation?.();
              closeDeleteQuotationDialog();
            }}>
            {t('quotation.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: resetQuotation
  });

  return {
    deleteQuotationDialog,
    openDeleteQuotationDialog,
    closeDeleteQuotationDialog
  };
};
