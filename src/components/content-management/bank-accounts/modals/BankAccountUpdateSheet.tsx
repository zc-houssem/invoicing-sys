import { BookUser } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { UpdateBankAccountForm } from '../forms/UpdateBankAccountForm';

interface BankAccountUpdateSheet {
  updateBankAccount: () => void;
  isUpdatePending?: boolean;
  resetBankAccount?: () => void;
}

export const useBankAccountUpdateSheet = ({
  updateBankAccount,
  isUpdatePending = false,
  resetBankAccount
}: BankAccountUpdateSheet) => {
  const { t } = useTranslation('content-management');

  const {
    SheetFragment: updateBankAccountSheet,
    openSheet: openUpdateBankAccountSheet,
    closeSheet: closeUpdateBankAccountSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t('bankAccount.sheets.update.title')}
      </div>
    ),
    description: t('bankAccount.sheets.update.description'),
    children: (
      <UpdateBankAccountForm
        updateBankAccount={updateBankAccount}
        isUpdatePending={isUpdatePending}
      />
    ),
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetBankAccount
  });

  return {
    updateBankAccountSheet,
    openUpdateBankAccountSheet,
    closeUpdateBankAccountSheet
  };
};
