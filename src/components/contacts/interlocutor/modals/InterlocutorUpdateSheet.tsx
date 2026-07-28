import { BookUser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { InterlocutorUpdateForm } from '../form/InterlocutorUpdateForm';

export const useInterlocutorUpdateSheet = (resetInterlocutor?: () => void) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const store = useInterlocutorStore();

  const {
    SheetFragment: updateInterlocutorSheet,
    openSheet: openUpdateInterlocutorSheet,
    closeSheet: closeUpdateInterlocutorSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser className="w-5 h-5 text-gray-500" />
        {tContacts('interlocutor.update_dialog_title')}
      </div>
    ),
    description: tContacts('interlocutor.update_dialog_description'),
    children: (
      <div className="h-full py-4">
        {store.response?.id && (
          <InterlocutorUpdateForm
            interlocutorId={store.response.id}
            onSuccess={() => {
              closeUpdateInterlocutorSheet();
            }}
            onCancel={() => {
              closeUpdateInterlocutorSheet();
            }}
          />
        )}
      </div>
    ),
    className: 'min-w-[40vw]',
    onToggle: resetInterlocutor
  });

  return { updateInterlocutorSheet, openUpdateInterlocutorSheet, closeUpdateInterlocutorSheet };
};
