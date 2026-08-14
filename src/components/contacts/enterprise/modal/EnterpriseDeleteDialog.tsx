import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { useDialog } from '@/components/shared/Dialogs';

export const useEnterpriseDeleteDialog = (
  enterpriseName?: string,
  deleteEnterprise?: () => void,
  isDeletionPending?: boolean
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const {
    DialogFragment: deleteEnterpriseDialog,
    openDialog: openDeleteEnterpriseDialog,
    closeDialog: closeDeleteEnterpriseDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tContacts('enterprise.delete_prompt')}{' '}
        <span className="font-light">{enterpriseName}</span> ?
      </div>
    ),
    description: tContacts('enterprise.delete_dialog_description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteEnterprise?.();
              closeDeleteEnterpriseDialog();
            }}>
            {tCommon('commands.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeDeleteEnterpriseDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]'
  });

  return { deleteEnterpriseDialog, openDeleteEnterpriseDialog, closeDeleteEnterpriseDialog };
};
