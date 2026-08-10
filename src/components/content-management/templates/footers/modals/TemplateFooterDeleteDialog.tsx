import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface TemplateFooterDeleteDialogProps {
  representation?: string;
  deleteTemplateFooter?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useTemplateFooterDeleteDialog = ({
  representation,
  deleteTemplateFooter,
  isDeletionPending,
  reset
}: TemplateFooterDeleteDialogProps) => {
  const { t } = useTranslation('content-management');

  const {
    DialogFragment: deleteTemplateFooterDialog,
    openDialog: openDeleteTemplateFooterDialog,
    closeDialog: closeDeleteTemplateFooterDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('templateFooter.dialogs.delete.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('templateFooter.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteTemplateFooter?.();
              closeDeleteTemplateFooterDialog();
            }}>
            {t('templateFooter.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              reset?.();
              closeDeleteTemplateFooterDialog();
            }}>
            {t('templateFooter.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return {
    deleteTemplateFooterDialog,
    openDeleteTemplateFooterDialog,
    closeDeleteTemplateFooterDialog
  };
};
