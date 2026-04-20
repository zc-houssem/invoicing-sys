import { WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { TaxForm } from '../TaxForm';

export const useTaxUpdateSheet = (
  updateTax?: () => void,
  isUpdatePending?: boolean,
  disabled?: boolean,
  resetTax?: () => void
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const {
    SheetFragment: updateTaxSheet,
    openSheet: openUpdateTaxSheet,
    closeSheet: closeUpdateTaxSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {tSettings('tax.update_prompt')}
      </div>
    ),
    description: tSettings('tax.update_dialog_description'),
    children: (
      <div>
        <TaxForm className="my-4" />
        <div className="flex gap-2 justify-end">
          <Button
            disabled={disabled}
            onClick={() => {
              updateTax?.();
            }}>
            {tCommon('commands.save')}
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            disabled={disabled}
            variant={'secondary'}
            onClick={() => {
              closeUpdateTaxSheet();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'min-w-[25vw]',
    onToggle: resetTax
  });

  return { updateTaxSheet, openUpdateTaxSheet, closeUpdateTaxSheet };
};
