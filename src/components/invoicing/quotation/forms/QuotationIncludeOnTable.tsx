import { Switch } from '@/components/ui/switch';
import { QuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type QuotationDtoPrefix = 'createDto' | 'updateDto';

type QuotationIncludeFlagKey =
  | 'hasBankingDetails'
  | 'showArticleDescription'
  | 'showInvoiceAddress'
  | 'showDeliveryAddress'
  | 'hasGeneralConditions';

const INCLUDE_FLAG_KEYS: QuotationIncludeFlagKey[] = [
  'hasBankingDetails',
  'showArticleDescription',
  'showInvoiceAddress',
  'showDeliveryAddress',
  'hasGeneralConditions'
];

const INCLUDE_FLAG_LABEL_KEYS: Record<QuotationIncludeFlagKey, string> = {
  hasBankingDetails: 'quotation.form.includeOnQuotation.bankingDetails',
  showArticleDescription: 'quotation.form.includeOnQuotation.articlesDescription',
  showInvoiceAddress: 'quotation.form.includeOnQuotation.invoicingAddress',
  showDeliveryAddress: 'quotation.form.includeOnQuotation.deliveryAddress',
  hasGeneralConditions: 'quotation.form.includeOnQuotation.generalConditions'
};

export const DEFAULT_QUOTATION_INCLUDE_FLAGS = {
  hasBankingDetails: true,
  showArticleDescription: true,
  showInvoiceAddress: true,
  showDeliveryAddress: true,
  hasGeneralConditions: true
} as const;

interface QuotationIncludeOnTableProps {
  store: QuotationStore;
  dtoPrefix: QuotationDtoPrefix;
  disabled?: boolean;
  className?: string;
}

export const QuotationIncludeOnTable = ({
  store,
  dtoPrefix,
  disabled = false,
  className
}: QuotationIncludeOnTableProps) => {
  const { t } = useTranslation('invoicing');
  const dto = dtoPrefix === 'createDto' ? store.createDto : store.updateDto;

  return (
    <table className={cn('w-full text-sm', className)}>
      <tbody>
        {INCLUDE_FLAG_KEYS.map((key) => (
          <tr key={key}>
            <td className="py-1 pr-2 text-xs align-middle font-medium">
              {t(INCLUDE_FLAG_LABEL_KEYS[key])}
            </td>
            <td className="py-1 w-12 text-right align-middle">
              <Switch
                disabled={disabled}
                checked={dto?.[key] ?? true}
                onCheckedChange={(checked) => {
                  store.setNested(`${dtoPrefix}.${key}`, checked);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
