import { Switch } from '@/components/ui/switch';
import { InvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type InvoiceDtoPrefix = 'createDto' | 'updateDto';

type InvoiceIncludeFlagKey =
  | 'hasBankingDetails'
  | 'showArticleDescription'
  | 'showInvoiceAddress'
  | 'showDeliveryAddress'
  | 'hasGeneralConditions'
  | 'hasTaxStamp';

const INCLUDE_FLAG_KEYS: InvoiceIncludeFlagKey[] = [
  'hasBankingDetails',
  'showArticleDescription',
  'showInvoiceAddress',
  'showDeliveryAddress',
  'hasGeneralConditions',
  'hasTaxStamp'
];

const INCLUDE_FLAG_LABEL_KEYS: Record<InvoiceIncludeFlagKey, string> = {
  hasBankingDetails: 'invoice.form.includeOnInvoice.bankingDetails',
  showArticleDescription: 'invoice.form.includeOnInvoice.articlesDescription',
  showInvoiceAddress: 'invoice.form.includeOnInvoice.invoicingAddress',
  showDeliveryAddress: 'invoice.form.includeOnInvoice.deliveryAddress',
  hasGeneralConditions: 'invoice.form.includeOnInvoice.generalConditions',
  hasTaxStamp: 'invoice.form.includeOnInvoice.taxStamp'
};

export const DEFAULT_INVOICE_INCLUDE_FLAGS = {
  hasBankingDetails: true,
  showArticleDescription: true,
  showInvoiceAddress: true,
  showDeliveryAddress: true,
  hasGeneralConditions: true,
  hasTaxStamp: true
} as const;

interface InvoiceIncludeOnTableProps {
  store: InvoiceStore;
  dtoPrefix: InvoiceDtoPrefix;
  disabled?: boolean;
  className?: string;
}

export const InvoiceIncludeOnTable = ({
  store,
  dtoPrefix,
  disabled = false,
  className
}: InvoiceIncludeOnTableProps) => {
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
                  if (key === 'hasTaxStamp' && !checked) {
                    store.setNested(`${dtoPrefix}.taxStamp`, 0);
                  }
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
