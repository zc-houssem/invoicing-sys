import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useBankAccountStore } from '@/hooks/stores/useBankAccountStore';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { updateBankAccountSchema } from '@/types/validations/bank-account.validation';
import { useUpdateBankAccountFormStructure } from './useUpdateBankAccountFormStructure';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import { Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t: tCommon } = useTranslation('common');
  const bankAccountStore = useBankAccountStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useUpdateBankAccountFormStructure({
    store: bankAccountStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency: ResponseRefParamDto<CurrencyPayload>) => ({
          label: `${currency.label} (${currency.extras.symbol})`,
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
        <Button variant="secondary" onClick={() => bankAccountStore.reset()} disabled={isUpdatePending}>
          <Repeat2 /> {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isUpdatePending}>
          <Save /> {tCommon('commands.save')}
        </Button>
      </div>
    </div>
  );
};
