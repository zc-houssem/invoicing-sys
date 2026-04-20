import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useTaxRateStore } from '@/hooks/stores/useTaxRateStore';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { updateTaxRateSchema } from '@/types/validations/tax.validation';
import { useUpdateTaxRateFormStructure } from './useUpdateTaxRateFormStructure';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';

interface UpdateTaxRateFormProps {
  className?: string;
  updateTaxRate: () => void;
  isUpdatePending: boolean;
}

export const UpdateTaxRateForm = ({
  className,
  updateTaxRate,
  isUpdatePending
}: UpdateTaxRateFormProps) => {
  const taxRateStore = useTaxRateStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useUpdateTaxRateFormStructure({
    store: taxRateStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency: ResponseRefParamDto<CurrencyPayload>) => ({
          label: `${currency.label} (${currency.extras.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = updateTaxRateSchema.safeParse(taxRateStore.updateDto);
    if (!result.success) {
      taxRateStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
    } else {
      updateTaxRate();
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
        <Button variant={'outline'} onClick={() => taxRateStore.reset()}>
          Reset
        </Button>
      </div>
    </div>
  );
};
