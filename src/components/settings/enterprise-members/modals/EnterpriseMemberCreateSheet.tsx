import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { EnterpriseMemberCreateForm } from '../forms/EnterpriseMemberCreateForm';
import { useEnterpriseMemberStore } from '@/hooks/stores/useEnterpriseMemberStore';

interface EnterpriseMemberCreateSheetProps {
  enterpriseId?: number;
  onSuccess?: () => void;
}

export const useEnterpriseMemberCreateSheet = ({
  enterpriseId,
  onSuccess
}: EnterpriseMemberCreateSheetProps) => {
  const { t: tSettings } = useTranslation('settings');
  const memberStore = useEnterpriseMemberStore();

  const {
    SheetFragment: createMemberSheet,
    openSheet: openCreateMemberSheet,
    closeSheet: closeCreateMemberSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Users />
        {tSettings('members.sheets.create.title')}
      </div>
    ),
    description: tSettings('members.sheets.create.description'),
    children: (
      <EnterpriseMemberCreateForm
        enterpriseId={enterpriseId}
        onSuccess={() => {
          onSuccess?.();
          closeCreateMemberSheet();
        }}
        onCancel={() => closeCreateMemberSheet()}
      />
    ),
    className: 'min-w-[40vw] flex flex-col flex-1 overflow-hidden',
    onToggle: () => memberStore.reset()
  });

  return { createMemberSheet, openCreateMemberSheet };
};
