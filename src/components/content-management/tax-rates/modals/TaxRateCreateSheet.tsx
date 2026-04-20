import { WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { TaxForm } from '../TaxForm';

export const useTaxCreateSheet = (
  createTax?: () => void,
  isCreatePending?: boolean,
  resetTax?: () => void
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const {
    SheetFragment: createTaxSheet,
    openSheet: openCreateTaxSheet,
    closeSheet: closeCreateTaxSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {tSettings('tax.create_prompt')}
      </div>
    ),
    description: tSettings('tax.create_dialog_description'),
    children: (
      <div>
        <TaxForm className="my-4" />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              createTax?.();
            }}>
            {tCommon('commands.save')}
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeCreateTaxSheet();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'min-w-[25vw]',
    onToggle: resetTax
  });

  return { createTaxSheet, openCreateTaxSheet, closeCreateTaxSheet };
};
