import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface TaxRateDeleteDialogProps {
  representation?: string;
  deleteTaxRate?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useTaxRateDeleteDialog = ({
  representation,
  deleteTaxRate,
  isDeletionPending,
  reset
}: TaxRateDeleteDialogProps) => {
  const { t } = useTranslation('content-management');

  const {
    DialogFragment: deleteTaxRateDialog,
    openDialog: openDeleteTaxRateDialog,
    closeDialog: closeDeleteTaxRateDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('taxRate.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('taxRate.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteTaxRate?.();
              closeDeleteTaxRateDialog();
            }}>
            {t('taxRate.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              reset?.();
              closeDeleteTaxRateDialog();
            }}>
            {t('taxRate.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return {
    deleteTaxRateDialog,
    openDeleteTaxRateDialog,
    closeDeleteTaxRateDialog
  };
};
