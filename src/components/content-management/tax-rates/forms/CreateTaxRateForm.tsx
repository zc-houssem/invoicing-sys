import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useCreateTaxRateFormStructure } from './useCreateTaxFormStructure';
import { useTaxRateStore } from '@/hooks/stores/useTaxRateStore';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { createTaxRateSchema } from '@/types/validations/tax.validation';
import { Repeat2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateTaxRateFormProps {
  className?: string;
  createTaxRate: () => void;
  isCreatePending: boolean;
}

export const CreateTaxRateForm = ({
  className,
  createTaxRate,
  isCreatePending
}: CreateTaxRateFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const taxRateStore = useTaxRateStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useCreateTaxRateFormStructure({
    store: taxRateStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.extras.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = createTaxRateSchema.safeParse(taxRateStore.createDto);
    if (!result.success) {
      taxRateStore.set('createDtoErrors', result.error.flatten().fieldErrors);
    } else {
      createTaxRate();
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="secondary"
          onClick={() => taxRateStore.reset()}
          disabled={isCreatePending}>
          <Repeat2 /> {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isCreatePending}>
          <Save /> {tCommon('commands.save')}
        </Button>
      </div>
    </div>
  );
};
