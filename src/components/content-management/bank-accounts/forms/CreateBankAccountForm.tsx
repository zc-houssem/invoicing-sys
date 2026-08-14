import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useCreateBankAccountFormStructure } from './useCreateBankAccountFormStructure';
import { useBankAccountStore } from '@/hooks/stores/useBankAccountStore';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { createBankAccountSchema } from '@/types/validations/bank-account.validation';
import { Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateBankAccountFormProps {
  className?: string;
  createBankAccount: () => void;
  isCreatePending: boolean;
}

export const CreateBankAccountForm = ({
  className,
  createBankAccount,
  isCreatePending
}: CreateBankAccountFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const bankAccountStore = useBankAccountStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useCreateBankAccountFormStructure({
    store: bankAccountStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.extras.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = createBankAccountSchema.safeParse(bankAccountStore.createDto);
    if (!result.success) {
      bankAccountStore.set('createDtoErrors', result.error.flatten().fieldErrors);
    } else {
      createBankAccount();
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button variant="secondary" onClick={() => bankAccountStore.reset()} disabled={isCreatePending}>
          <Repeat2 /> {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isCreatePending}>
          <Save /> {tCommon('commands.save')}
        </Button>
      </div>
    </div>
  );
};
