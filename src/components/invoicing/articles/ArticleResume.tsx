import { Spinner } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxRates } from '@/hooks/content/core/useTaxRates';
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { CurrencyPayload, ResponseRefParamDto, TaxWithholdingPayload } from '@/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArticleResumeProps {
  className?: string;
  currency?: ResponseRefParamDto<CurrencyPayload>;
  includeHeader?: boolean;
  taxWithholding?: ResponseRefParamDto<TaxWithholdingPayload>;
  taxWithholdingExcludeTaxes?: boolean;
  onTaxWithholdingExcludeTaxesChange?: (excludeTaxes: boolean) => void;
  amountPaid?: number;
  payments?: any[];
  showPaymentSummary?: boolean;
  status?: string;
  disabled?: boolean;
  taxStamp?: number;
  onTaxStampChange?: (value: number) => void;
}

export function ArticleResume({
  className,
  currency,
  includeHeader,
  taxWithholding,
  taxWithholdingExcludeTaxes = true,
  onTaxWithholdingExcludeTaxesChange,
  amountPaid,
  payments,
  showPaymentSummary,
  status,
  disabled,
  taxStamp = 0,
  onTaxStampChange
}: ArticleResumeProps) {
  const articleStore = useArticleStore();
  const { t } = useTranslation('invoicing');

  const { taxRates, isTaxRatesPending } = useTaxRates({
    join: ['currency']
  });

  const isDraftOrValidated = React.useMemo(() => {
    if (!status) return false;
    const s = String(status)
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    return s === 'draft' || s === 'validated';
  }, [status]);

  const totalPriceExcludingTax = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      const qty = Number(article.quantity) || 0;
      const price = Number(article.unitPrice) || 0;
      const basePrice = qty * price;
      const discVal = Number(article.discountValue) || 0;
      const discount = article.discountType === 'fixed' ? discVal : basePrice * (discVal / 100);
      return prev + (basePrice - discount);
    }, 0);
  }, [articleStore.articles]);

  const totalPriceIncludingTax = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      const qty = Number(article.quantity) || 0;
      const price = Number(article.unitPrice) || 0;
      const basePrice = qty * price;
      const discVal = Number(article.discountValue) || 0;

      let finalPrice = basePrice;

      // discount
      if (article.discountType === 'fixed') finalPrice -= discVal;
      else if (discVal) finalPrice *= 1 - discVal / 100;

      // tax
      article.taxIds?.forEach((taxId) => {
        const tax = taxRates.find((t) => t.id === taxId);
        if (tax) {
          const taxVal = Number(tax.value) || 0;
          if (tax.type === 'rate') finalPrice *= 1 + taxVal / 100;
          else finalPrice += taxVal;
        }
      });

      return prev + finalPrice;
    }, 0);
  }, [articleStore.articles, taxRates]);

  const discountValue = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      const qty = Number(article.quantity) || 0;
      const price = Number(article.unitPrice) || 0;
      const basePrice = qty * price;
      const discVal = Number(article.discountValue) || 0;

      let discount = 0;
      if (article.discountType === 'fixed') discount = discVal;
      else if (discVal) discount = basePrice * (discVal / 100);

      return prev + (isNaN(discount) ? 0 : discount);
    }, 0);
  }, [articleStore.articles]);

  const taxValue = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      let taxAmount = 0;
      const qty = Number(article.quantity) || 0;
      const price = Number(article.unitPrice) || 0;
      const basePrice = qty * price;
      const discVal = Number(article.discountValue) || 0;

      const discount = article.discountType === 'fixed' ? discVal : basePrice * (discVal / 100);

      const priceAfterDiscount = basePrice - discount;

      article.taxIds?.forEach((taxId) => {
        const tax = taxRates.find((t) => t.id === taxId);
        if (tax) {
          const taxVal = Number(tax.value) || 0;
          if (tax.type === 'rate') taxAmount += priceAfterDiscount * (taxVal / 100);
          else taxAmount += taxVal;
        }
      });
      return prev + taxAmount;
    }, 0);
  }, [articleStore.articles, taxRates]);

  const taxStampValue = Number(taxStamp) || 0;
  const currencyDigits = Number(currency?.extras?.digitsAfterComma ?? 3);
  const currencySymbol = currency?.extras?.symbol || '';
  const formattedTaxStampValue = taxStampValue
    ? `${taxStampValue.toFixed(currencyDigits)} ${currencySymbol}`.trim()
    : undefined;

  const taxWithholdingAmount = React.useMemo(() => {
    if (!taxWithholding || !taxWithholding.extras?.rate) return 0;
    const base = !taxWithholdingExcludeTaxes ? totalPriceExcludingTax : totalPriceIncludingTax;
    return base * (taxWithholding.extras.rate / 100);
  }, [taxWithholding, taxWithholdingExcludeTaxes, totalPriceExcludingTax, totalPriceIncludingTax]);

  const { baseSummary, afterStampSummary } = React.useMemo(() => {
    if (articleStore.articles.length === 0) {
      return { baseSummary: [], afterStampSummary: [] };
    }

    const digits = Number(currency?.extras?.digitsAfterComma ?? 3);
    const symbol = currency?.extras?.symbol || '';

    const base: Array<{ label: string; value?: string }> = [
      {
        label: t('article.form.priceExcludingTax'),
        value: totalPriceExcludingTax
          ? `${totalPriceExcludingTax.toFixed(digits)} ${symbol}`
          : undefined
      },
      {
        label: t('article.form.totalDiscount'),
        value: discountValue ? `${Number(discountValue).toFixed(digits)} ${symbol}` : undefined
      },
      {
        label: t('article.form.totalTax'),
        value: taxValue ? `${taxValue.toFixed(digits)} ${symbol}` : undefined
      },
      {
        label: t('article.form.priceIncludingTax'),
        value: totalPriceIncludingTax
          ? `${totalPriceIncludingTax.toFixed(digits)} ${symbol}`
          : undefined
      }
    ];

    const after: Array<{ label: string; value?: string }> = [];
    const totalWithStamp = totalPriceIncludingTax + taxStampValue;
    const netToPay = totalWithStamp - taxWithholdingAmount;

    if (taxWithholding && taxWithholding.extras?.rate) {
      after.push({
        label: `${t('invoice.form.taxWithholding', { defaultValue: 'Tax Withholding' })} (${taxWithholding.extras.rate}%)`,
        value: taxWithholdingAmount
          ? `-${taxWithholdingAmount.toFixed(digits)} ${symbol}`
          : undefined
      });
    }

    if ((taxWithholding && taxWithholding.extras?.rate) || taxStampValue > 0 || onTaxStampChange) {
      after.push({
        label: t('article.form.netToPay', { defaultValue: 'Net to Pay' }),
        value: `${netToPay.toFixed(digits)} ${symbol}`
      });
    }

    if (
      !isDraftOrValidated &&
      (showPaymentSummary || amountPaid !== undefined || (payments && payments.length > 0))
    ) {
      let paidVal = 0;
      if (typeof amountPaid === 'number') {
        paidVal = amountPaid;
      } else if (Array.isArray(payments) && payments.length > 0) {
        paidVal = payments.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);
      }

      const effectiveNet =
        taxWithholding && taxWithholding.extras?.rate ? netToPay : totalWithStamp;
      const remainingVal = Math.max(0, effectiveNet - paidVal);

      after.push({
        label: t('invoice.form.amountPaid', { defaultValue: 'Amount Paid' }),
        value: `${paidVal.toFixed(digits)} ${symbol}`
      });
      after.push({
        label: t('invoice.remaining', { defaultValue: 'Remaining' }),
        value: `${remainingVal.toFixed(digits)} ${symbol}`
      });
    }

    return { baseSummary: base, afterStampSummary: after };
  }, [
    articleStore.articles.length,
    totalPriceExcludingTax,
    discountValue,
    taxValue,
    totalPriceIncludingTax,
    currency,
    t,
    taxWithholding,
    taxWithholdingAmount,
    taxStampValue,
    onTaxStampChange,
    showPaymentSummary,
    amountPaid,
    payments,
    isDraftOrValidated
  ]);

  if (isTaxRatesPending) return <Spinner />;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {includeHeader && <span className="font-bold text-xl">{t('common.financialResume')}</span>}
      <table className="w-full mt-2">
        <tbody>
          {baseSummary.map((item, index) => (
            <tr key={`base-${index}`}>
              <td className="text-start">
                <Label className="text-xs font-thin">{item.label}</Label>
              </td>
              <td className="text-muted-foreground text-end text-xs">{item.value || '-'}</td>
            </tr>
          ))}
          {onTaxStampChange && (
            <tr>
              <td className="text-start">
                <Label className="text-xs font-thin">{t('article.form.taxStamp')}</Label>
              </td>
              <td className={cn('text-end', disabled ? 'text-muted-foreground text-xs' : 'py-1')}>
                {disabled ? (
                  formattedTaxStampValue || '-'
                ) : (
                  <div className="ml-auto flex max-w-[180px] items-center justify-end gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      step="0.001"
                      value={taxStampValue}
                      onChange={(event) => {
                        onTaxStampChange(Number(event.target.value) || 0);
                      }}
                      className="h-8 max-w-[120px] text-end text-xs"
                    />
                    {currencySymbol && (
                      <span className="text-xs text-muted-foreground">{currencySymbol}</span>
                    )}
                  </div>
                )}
              </td>
            </tr>
          )}
          {afterStampSummary.map((item, index) => (
            <tr key={`after-${index}`}>
              <td className="text-start">
                <Label className="text-xs font-thin">{item.label}</Label>
              </td>
              <td className="text-muted-foreground text-end text-xs">{item.value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {taxWithholding && (
        <div className={cn('flex items-center gap-2 mt-2', disabled && 'opacity-50')}>
          <Checkbox
            id="apply-to-ht"
            checked={!taxWithholdingExcludeTaxes}
            disabled={disabled}
            onCheckedChange={(checked) => {
              if (disabled) return;
              onTaxWithholdingExcludeTaxesChange?.(checked !== true);
            }}
          />
          <Label htmlFor="apply-to-ht" className={cn('text-xs', disabled && 'cursor-not-allowed')}>
            {t('article.form.applyTaxWithholdingToHT', { defaultValue: 'Calculate from Price HT' })}
          </Label>
        </div>
      )}
    </div>
  );
}
