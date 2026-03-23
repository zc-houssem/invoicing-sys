import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useCreateBankAccountFormStructure } from './useCreateBankAccountFormStructure';
import { useBankAccountStore } from '@/hooks/stores/useBankAccountStore';
import useCurrencies from '@/hooks/content/useCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { createBankAccountSchema } from '@/types/validations/bank-account.validation';

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
  const bankAccountStore = useBankAccountStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useCreateBankAccountFormStructure({
    store: bankAccountStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.symbol})`,
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
        <Button onClick={handleSubmit} disabled={isCreatePending}>
          Save
        </Button>
        <Button variant={'outline'} onClick={() => bankAccountStore.reset()}>
          Reset
        </Button>
      </div>
    </div>
  );
};
