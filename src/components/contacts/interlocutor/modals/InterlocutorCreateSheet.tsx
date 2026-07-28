import { BookUser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { InterlocutorCreateForm } from '../form/InterlocutorCreateForm';

export const useInterlocutorCreateSheet = (
  resetInterlocutor?: () => void
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const {
    SheetFragment: createInterlocutorSheet,
    openSheet: openCreateInterlocutorSheet,
    closeSheet: closeCreateInterlocutorSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {tContacts('interlocutor.new')}
      </div>
    ),
    description: tContacts('interlocutor.create_dialog_description'),
    children: (
      <div className="h-full py-4">
        <InterlocutorCreateForm
          onSuccess={() => {
            closeCreateInterlocutorSheet();
          }}
          onCancel={() => {
            closeCreateInterlocutorSheet();
          }}
        />
      </div>
    ),
    className: 'min-w-[40vw]',
    onToggle: resetInterlocutor
  });

  return { createInterlocutorSheet, openCreateInterlocutorSheet, closeCreateInterlocutorSheet };
};
