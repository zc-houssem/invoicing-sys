import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface EnterpriseMemberMakeProprietaryDialogProps {
  representation?: string;
  makeProprietary?: () => void;
  isPending?: boolean;
  reset?: () => void;
}

export const useEnterpriseMemberMakeProprietaryDialog = ({
  representation,
  makeProprietary,
  isPending,
  reset
}: EnterpriseMemberMakeProprietaryDialogProps) => {
  const { t: tSettings } = useTranslation('settings');

  const {
    DialogFragment: makeProprietaryDialog,
    openDialog: openMakeProprietaryDialog,
    closeDialog: closeMakeProprietaryDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tSettings('members.dialogs.makeProprietary.title')}{' '}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: tSettings('members.dialogs.makeProprietary.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              makeProprietary?.();
              closeMakeProprietaryDialog();
            }}>
            {tSettings('members.dialogs.makeProprietary.confirm')}
            <Spinner show={isPending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              reset?.();
              closeMakeProprietaryDialog();
            }}>
            {tSettings('members.dialogs.makeProprietary.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return { makeProprietaryDialog, openMakeProprietaryDialog };
};
