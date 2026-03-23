import { BookUser } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { CreateBankAccountForm } from '../forms/CreateBankAccountForm';

interface BankAccountCreateSheet {
  createBankAccount: () => void;
  isCreatePending?: boolean;
  resetBankAccount?: () => void;
}

export const useBankAccountCreateSheet = ({
  createBankAccount,
  isCreatePending = false,
  resetBankAccount
}: BankAccountCreateSheet) => {
  const { t } = useTranslation('bankAccount');

  const {
    SheetFragment: createBankAccountSheet,
    openSheet: openCreateBankAccountSheet,
    closeSheet: closeCreateBankAccountSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t('sheet.create.title')}
      </div>
    ),
    description: t('sheet.create.description'),
    children: (
      <CreateBankAccountForm
        createBankAccount={createBankAccount}
        isCreatePending={isCreatePending}
      />
    ),
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetBankAccount
  });

  return {
    createBankAccountSheet,
    openCreateBankAccountSheet,
    closeCreateBankAccountSheet
  };
};
