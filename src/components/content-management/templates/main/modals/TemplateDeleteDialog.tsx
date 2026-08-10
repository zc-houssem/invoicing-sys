import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface TemplateDeleteDialogProps {
  representation?: string;
  deleteTemplate?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useTemplateDeleteDialog = ({
  representation,
  deleteTemplate,
  isDeletionPending,
  reset
}: TemplateDeleteDialogProps) => {
  const { t } = useTranslation('content-management');

  const {
    DialogFragment: deleteTemplateDialog,
    openDialog: openDeleteTemplateDialog,
    closeDialog: closeDeleteTemplateDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('template.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('template.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteTemplate?.();
              closeDeleteTemplateDialog();
            }}>
            {t('template.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              reset?.();
              closeDeleteTemplateDialog();
            }}>
            {t('template.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return {
    deleteTemplateDialog,
    openDeleteTemplateDialog,
    closeDeleteTemplateDialog
  };
};
