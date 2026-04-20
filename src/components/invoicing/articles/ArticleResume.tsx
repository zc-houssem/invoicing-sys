import { Spinner } from '@/components/shared';
import { Label } from '@/components/ui/label';
import { useTaxRates } from '@/hooks/content/core/useTaxRates';
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { cn } from '@/lib/utils';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArticleResumeProps {
  className?: string;
  currency?: ResponseRefParamDto<CurrencyPayload>;
}

export function ArticleResume({ className, currency }: ArticleResumeProps) {
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

  const data = React.useMemo(() => {
    if (articleStore.articles.length === 0) return [];
    return [
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
  }, [totalPriceExcludingTax, discountValue, taxValue, totalPriceIncludingTax, currency, t]);

  if (isTaxRatesPending) return <Spinner />;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="font-bold text-xl">{t('common.financialResume')}</span>
      <table className="w-full mt-2">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="text-start">
              <Label className="text-sm font-semibold">{item.label}</Label>
            </td>
            <td className="text-muted-foreground text-end">{item.value}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
