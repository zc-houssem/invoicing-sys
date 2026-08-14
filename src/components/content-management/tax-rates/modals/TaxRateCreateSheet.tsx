import { WalletCards } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { CreateTaxRateForm } from '../forms/CreateTaxRateForm';

interface TaxRateCreateSheetProps {
  createTaxRate: () => void;
  isCreatePending?: boolean;
  resetTaxRate?: () => void;
}

export const useTaxRateCreateSheet = ({
  createTaxRate,
  isCreatePending = false,
  resetTaxRate
}: TaxRateCreateSheetProps) => {
  const { t } = useTranslation('content-management');

  const {
    SheetFragment: createTaxRateSheet,
    openSheet: openCreateTaxRateSheet,
    closeSheet: closeCreateTaxRateSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {t('taxRate.sheets.create.title')}
      </div>
    ),
    description: t('taxRate.sheets.create.description'),
    children: <CreateTaxRateForm createTaxRate={createTaxRate} isCreatePending={isCreatePending} />,
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetTaxRate
  });

  return {
    createTaxRateSheet,
    openCreateTaxRateSheet,
    closeCreateTaxRateSheet
  };
};
