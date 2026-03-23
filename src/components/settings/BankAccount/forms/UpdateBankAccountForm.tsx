import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useBankAccountStore } from '@/hooks/stores/useBankAccountStore';
import useCurrencies from '@/hooks/content/useCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { updateBankAccountSchema } from '@/types/validations/bank-account.validation';
import { useUpdateBankAccountFormStructure } from './useUpdateBankAccountFormStructure';

interface UpdateBankAccountFormProps {
  className?: string;
  updateBankAccount: () => void;
  isUpdatePending: boolean;
}

export const UpdateBankAccountForm = ({
  className,
  updateBankAccount,
  isUpdatePending
}: UpdateBankAccountFormProps) => {
  const bankAccountStore = useBankAccountStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useUpdateBankAccountFormStructure({
    store: bankAccountStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = updateBankAccountSchema.safeParse(bankAccountStore.updateDto);
    console.log(result);
    if (!result.success) {
      bankAccountStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
    } else {
      updateBankAccount();
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button onClick={handleSubmit} disabled={isUpdatePending}>
          Save
        </Button>
        <Button variant={'outline'} onClick={() => bankAccountStore.reset()}>
          Reset
        </Button>
      </div>
    </div>
  );
};
