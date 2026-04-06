import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { useDialog } from '@/components/shared/Dialogs';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';

export const useInterlocutorDisassociateDialog = (
  interlocutorFullName?: string,
  disassociateInterlocutor?: (id?: number) => void,
  isDisassociatePending?: boolean
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const interlocutorStore = useInterlocutorStore();

  const {
    DialogFragment: disassociateInterlocutorDialog,
    openDialog: openDisassociateInterlocutorDialog,
    closeDialog: closeDisassociateInterlocutorDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tContacts('interlocutor.disassociate_prompt')}{' '}
        <span className="font-light">{interlocutorFullName}</span> ?
      </div>
    ),
    description: tContacts('interlocutor.disassociate_dialog_description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              disassociateInterlocutor?.(interlocutorStore.id);
              closeDisassociateInterlocutorDialog();
            }}>
            {tCommon('commands.confirm')}
            <Spinner show={isDisassociatePending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeDisassociateInterlocutorDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]'
  });

  return {
    disassociateInterlocutorDialog,
    openDisassociateInterlocutorDialog,
    closeDisassociateInterlocutorDialog
  };
};
