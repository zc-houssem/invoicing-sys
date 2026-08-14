import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface EnterpriseMemberRemoveDialogProps {
  representation?: string;
  removeMember?: () => void;
  isRemovePending?: boolean;
  reset?: () => void;
}

export const useEnterpriseMemberRemoveDialog = ({
  representation,
  removeMember,
  isRemovePending,
  reset
}: EnterpriseMemberRemoveDialogProps) => {
  const { t: tSettings } = useTranslation('settings');

  const {
    DialogFragment: removeMemberDialog,
    openDialog: openRemoveMemberDialog,
    closeDialog: closeRemoveMemberDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tSettings('members.dialogs.remove.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: tSettings('members.dialogs.remove.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              removeMember?.();
              closeRemoveMemberDialog();
            }}>
            {tSettings('members.dialogs.remove.confirm')}
            <Spinner show={isRemovePending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              reset?.();
              closeRemoveMemberDialog();
            }}>
            {tSettings('members.dialogs.remove.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return { removeMemberDialog, openRemoveMemberDialog };
};
