import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { useEnterpriseMemberStore } from '@/hooks/stores/useEnterpriseMemberStore';
import { UserSystemEnterpriseAddForm } from '../forms/UserSystemEnterpriseAddForm';

interface UserSystemEnterpriseAddSheetProps {
  userId: string;
  onSuccess?: () => void;
}

export const useUserSystemEnterpriseAddSheet = ({
  userId,
  onSuccess
}: UserSystemEnterpriseAddSheetProps) => {
  const { t: tUser } = useTranslation('user-management');

  const {
    SheetFragment: addSystemEnterpriseSheet,
    openSheet: openAddSystemEnterpriseSheet,
    closeSheet: closeAddSystemEnterpriseSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Building2 />
        {tUser('userManagement.details.systemEnterprises.sheets.create.title')}
      </div>
    ),
    description: tUser('userManagement.details.systemEnterprises.sheets.create.description'),
    children: (
      <UserSystemEnterpriseAddForm
        userId={userId}
        onSuccess={() => {
          onSuccess?.();
          closeAddSystemEnterpriseSheet();
        }}
        onCancel={() => closeAddSystemEnterpriseSheet()}
      />
    ),
    className: 'min-w-[40vw] flex flex-col flex-1 overflow-hidden',
    onToggle: () => useEnterpriseMemberStore.getState().reset()
  });

  return { addSystemEnterpriseSheet, openAddSystemEnterpriseSheet };
};
