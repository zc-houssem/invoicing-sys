import { Spinner } from '@/components/shared';
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
}

export function ArticleResume({ className, currency, includeHeader, taxWithholding }: ArticleResumeProps) {
  const articleStore = useArticleStore();
  const { t } = useTranslation('invoicing');

  const { taxRates, isTaxRatesPending } = useTaxRates({
    join: ['currency']
  });

  const totalPriceExcludingTax = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      return prev + article.quantity * article.unitPrice;
    }, 0);
  }, [articleStore.articles]);

  const totalPriceIncludingTax = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      let finalPrice = article.quantity * article.unitPrice;

      // discount
      if (article.discountType === 'fixed') finalPrice -= article.discountValue;
      else finalPrice *= 1 - article.discountValue / 100;

      // tax
      article.taxIds?.forEach((taxId) => {
        const tax = taxRates.find((t) => t.id === taxId);
        if (tax) {
          if (tax.type === 'rate') finalPrice *= 1 + tax.value / 100;
          else finalPrice += tax.value;
        }
      });

      return prev + finalPrice;
    }, 0);
  }, [articleStore.articles, taxRates]);

  const discountValue = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      let discount = 0;
      if (article.discountType === 'fixed') discount = article.discountValue;
      else discount = article.quantity * article.unitPrice * (article.discountValue / 100);
      return prev + discount;
    }, 0);
  }, [articleStore.articles]);

  const taxValue = React.useMemo(() => {
    if (articleStore.articles.length === 0) return 0;
    return articleStore.articles.reduce((prev, article) => {
      let taxAmount = 0;
      article.taxIds?.forEach((taxId) => {
        const tax = taxRates.find((t) => t.id === taxId);
        if (tax) {
          const priceAfterDiscount =
            article.quantity * article.unitPrice -
            (article.discountType === 'fixed'
              ? article.discountValue
              : article.quantity * article.unitPrice * (article.discountValue / 100));
          if (tax.type === 'rate') taxAmount += priceAfterDiscount * (tax.value / 100);
          else taxAmount += tax.value;
        }
      });
      return prev + taxAmount;
    }, 0);
  }, [articleStore.articles, taxRates]);

  const [applyTaxWithholdingToHT, setApplyTaxWithholdingToHT] = React.useState(true);

  const taxWithholdingAmount = React.useMemo(() => {
    if (!taxWithholding || !taxWithholding.extras?.rate) return 0;
    const base = applyTaxWithholdingToHT ? totalPriceExcludingTax : totalPriceIncludingTax;
    return base * (taxWithholding.extras.rate / 100);
  }, [taxWithholding, applyTaxWithholdingToHT, totalPriceExcludingTax, totalPriceIncludingTax]);

  const data = React.useMemo(() => {
    if (articleStore.articles.length === 0) return [];
    const items: Array<{label: string; value?: string}> = [
      {
        label: t('article.form.priceExcludingTax'),
        value: totalPriceExcludingTax
          ? `${totalPriceExcludingTax.toFixed(currency?.extras.digitsAfterComma || 2)} ${
              currency?.extras.symbol || ''
            }`
          : undefined
      },
      {
        label: t('article.form.totalDiscount'),
        value: discountValue
          ? `${Number(discountValue).toFixed(currency?.extras.digitsAfterComma || 2)} ${
              currency?.extras.symbol || ''
            }`
          : undefined
      },
      {
        label: t('article.form.totalTax'),
        value: taxValue
          ? `${taxValue.toFixed(currency?.extras.digitsAfterComma || 2)} ${
              currency?.extras.symbol || ''
            }`
          : undefined
      },
      {
        label: t('article.form.priceIncludingTax'),
        value: totalPriceIncludingTax
          ? `${totalPriceIncludingTax.toFixed(currency?.extras.digitsAfterComma || 2)} ${
              currency?.extras.symbol || ''
            }`
          : undefined
      }
    ];

    if (taxWithholding && taxWithholding.extras?.rate) {
      items.push({
        label: `${t('invoice.form.taxWithholding', { defaultValue: 'Tax Withholding' })} (${taxWithholding.extras.rate}%)`,
        value: taxWithholdingAmount
          ? `-${taxWithholdingAmount.toFixed(currency?.extras.digitsAfterComma || 2)} ${
              currency?.extras.symbol || ''
            }`
          : undefined
      });
      items.push({
        label: t('article.form.netToPay', { defaultValue: 'Net to Pay' }),
        value: `${(totalPriceIncludingTax - taxWithholdingAmount).toFixed(currency?.extras.digitsAfterComma || 2)} ${
          currency?.extras.symbol || ''
        }`
      });
    }

    return items;
  }, [totalPriceExcludingTax, discountValue, taxValue, totalPriceIncludingTax, currency, t, taxWithholding, taxWithholdingAmount]);

  if (isTaxRatesPending) return <Spinner />;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {includeHeader && <span className="font-bold text-xl">{t('common.financialResume')}</span>}
      <table className="w-full mt-2">
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="text-start">
                <Label className="text-xs font-thin">{item.label}</Label>
              </td>
              <td className="text-muted-foreground text-end text-xs">{item.value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {taxWithholding && (
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="apply-to-ht"
            checked={applyTaxWithholdingToHT}
            onCheckedChange={(checked) => setApplyTaxWithholdingToHT(checked === true)}
          />
          <Label htmlFor="apply-to-ht" className="text-xs">
            {t('article.form.applyTaxWithholdingToHT', { defaultValue: 'Calculate from Price HT' })}
          </Label>
        </div>
      )}
    </div>
  );
}
