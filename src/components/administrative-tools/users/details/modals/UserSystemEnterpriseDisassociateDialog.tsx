import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface UserSystemEnterpriseDisassociateDialogProps {
  representation?: string;
  disassociate?: () => void;
  isPending?: boolean;
  reset?: () => void;
}

export const useUserSystemEnterpriseDisassociateDialog = ({
  representation,
  disassociate,
  isPending,
  reset
}: UserSystemEnterpriseDisassociateDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user-management');

  const {
    DialogFragment: disassociateDialog,
    openDialog: openDisassociateDialog,
    closeDialog: closeDisassociateDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tUser('userManagement.details.systemEnterprises.dialogs.disassociate.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: tUser('userManagement.details.systemEnterprises.dialogs.disassociate.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              disassociate?.();
              closeDisassociateDialog();
            }}>
            {tCommon('commands.confirm')}
            <Spinner show={isPending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              reset?.();
              closeDisassociateDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return { disassociateDialog, openDisassociateDialog };
};
