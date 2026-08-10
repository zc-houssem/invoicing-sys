import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface TemplateHeaderDeleteDialogProps {
  representation?: string;
  deleteTemplateHeader?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useTemplateHeaderDeleteDialog = ({
  representation,
  deleteTemplateHeader,
  isDeletionPending,
  reset
}: TemplateHeaderDeleteDialogProps) => {
  const { t } = useTranslation('content-management');

  const {
    DialogFragment: deleteTemplateHeaderDialog,
    openDialog: openDeleteTemplateHeaderDialog,
    closeDialog: closeDeleteTemplateHeaderDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('templateHeader.dialogs.delete.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('templateHeader.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteTemplateHeader?.();
              closeDeleteTemplateHeaderDialog();
            }}>
            {t('templateHeader.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              reset?.();
              closeDeleteTemplateHeaderDialog();
            }}>
            {t('templateHeader.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return {
    deleteTemplateHeaderDialog,
    openDeleteTemplateHeaderDialog,
    closeDeleteTemplateHeaderDialog
  };
};
