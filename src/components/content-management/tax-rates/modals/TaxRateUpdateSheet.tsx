import { WalletCards } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { UpdateTaxRateForm } from '../forms/UpdateTaxRateForm';

interface TaxRateUpdateSheetProps {
  updateTaxRate: () => void;
  isUpdatePending?: boolean;
  resetTaxRate?: () => void;
}

export const useTaxRateUpdateSheet = ({
  updateTaxRate,
  isUpdatePending = false,
  resetTaxRate
}: TaxRateUpdateSheetProps) => {
  const { t } = useTranslation('content-management');

  const {
    SheetFragment: updateTaxRateSheet,
    openSheet: openUpdateTaxRateSheet,
    closeSheet: closeUpdateTaxRateSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {t('taxRate.sheets.update.title')}
      </div>
    ),
    description: t('taxRate.sheets.update.description'),
    children: <UpdateTaxRateForm updateTaxRate={updateTaxRate} isUpdatePending={isUpdatePending} />,
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetTaxRate
  });

  return {
    updateTaxRateSheet,
    openUpdateTaxRateSheet,
    closeUpdateTaxRateSheet
  };
};
