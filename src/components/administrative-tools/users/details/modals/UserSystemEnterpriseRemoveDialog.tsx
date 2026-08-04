import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface UserSystemEnterpriseRemoveDialogProps {
  representation?: string;
  removeEnterprise?: () => void;
  isPending?: boolean;
  reset?: () => void;
}

export const useUserSystemEnterpriseRemoveDialog = ({
  representation,
  removeEnterprise,
  isPending,
  reset
}: UserSystemEnterpriseRemoveDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');

  const {
    DialogFragment: removeDialog,
    openDialog: openRemoveDialog,
    closeDialog: closeRemoveDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tUser('userManagement.details.systemEnterprises.dialogs.remove.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: tUser('userManagement.details.systemEnterprises.dialogs.remove.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              removeEnterprise?.();
              closeRemoveDialog();
            }}>
            {tUser('userManagement.details.systemEnterprises.actions.remove')}
            <Spinner show={isPending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              reset?.();
              closeRemoveDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return { removeDialog, openRemoveDialog };
};
