import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { useArticleItemFormStructure } from './useArticleItemFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import React from 'react';
import { CurrencyPayload, ResponseRefParamDto, ResponseTaxRateDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { useTaxRates } from '@/hooks/content/core/useTaxRates';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface ArticleItemProps {
  className?: string;
  disabled?: boolean;
  currency?: ResponseRefParamDto<CurrencyPayload>;
  index: number;
  showDescription?: boolean;
}

export function ArticleItem({
  className,
  index,
  currency,
  disabled,
  showDescription = true
}: ArticleItemProps) {
  const { t } = useTranslation('invoicing');
  const articleStore = useArticleStore();
  const { taxRates, isTaxRatesPending } = useTaxRates({
    join: ['currency']
  });
  const structure = useArticleItemFormStructure({
    store: articleStore,
    taxRateOptions: mapToSelectOptions({
      data: taxRates,
      labelKey: 'label',
      valueKey: 'id',
      labelKeyTransformer: (label, item: ResponseTaxRateDto) =>
        `${label} (${item.value}${item.type === 'rate' ? '%' : item.currency?.extras.symbol || ''})`
    }),
    index,
    disabled,
    showDescription
  });

  const { totalPriceExcludingTax, totalDiscount } = React.useMemo(() => {
    const article = articleStore.articles[index];
    const qty = Number(article.quantity) || 0;
    const price = Number(article.unitPrice) || 0;
    const basePrice = qty * price;
    const discVal = Number(article.discountValue) || 0;
    const discount = article.discountType === 'fixed' ? discVal : basePrice * (discVal / 100);
    return {
      totalPriceExcludingTax: basePrice - discount,
      totalDiscount: discount
    };
  }, [
    articleStore.articles[index].quantity,
    articleStore.articles[index].unitPrice,
    articleStore.articles[index].discountType,
    articleStore.articles[index].discountValue
  ]);

  const { totalPriceIncludingTax, totalTax } = React.useMemo(() => {
    const article = articleStore.articles[index];
    let finalPrice = totalPriceExcludingTax;

    // tax
    article.taxIds?.forEach((taxId) => {
      const tax = taxRates.find((t) => t.id === taxId);
      if (tax) {
        const taxVal = Number(tax.value) || 0;
        if (tax.type === 'rate') finalPrice *= 1 + taxVal / 100;
        else finalPrice += taxVal;
      }
    });

    return {
      totalPriceIncludingTax: finalPrice,
      totalTax: finalPrice - totalPriceExcludingTax
    };
  }, [
    totalPriceExcludingTax,
    articleStore.articles[index].discountType,
    articleStore.articles[index].discountValue,
    articleStore.articles[index].taxIds,
    taxRates
  ]);

  if (isTaxRatesPending) {
    return <Spinner />;
  }

  return (
    <div
      className={cn(
        'flex flex-col 2xl:flex-row gap-4 justify-between items-start 2xl:items-center p-2',
        className
      )}>
      <div className="flex-1 w-full overflow-hidden">
        <FormBuilder structure={structure} />
      </div>
      <div className="flex flex-row flex-wrap 2xl:flex-col justify-between items-baseline p-4 w-fit gap-4 2xl:gap-6 shrink-0 rounded-md bg-muted/10 border 2xl:border-transparent">
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.priceExcludingTax')}: </span>
          <span className="flex gap-1 font-light">
            <span>
              {totalPriceExcludingTax.toFixed(Number(currency?.extras?.digitsAfterComma ?? 3))}
            </span>
            <span>{currency?.extras?.symbol}</span>
          </span>
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.totalDiscount')}: </span>
          <span className="flex gap-1 font-light text-destructive">
            <span>-{totalDiscount.toFixed(Number(currency?.extras?.digitsAfterComma ?? 3))}</span>
            <span>{currency?.extras?.symbol}</span>
          </span>
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.totalTax')}: </span>
          <span className="flex gap-1 font-light">
            <span>+{totalTax.toFixed(Number(currency?.extras?.digitsAfterComma ?? 3))}</span>
            <span>{currency?.extras?.symbol}</span>
          </span>
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.priceIncludingTax')}: </span>
          <span className="flex gap-1 font-light">
            <span>
              {totalPriceIncludingTax.toFixed(Number(currency?.extras?.digitsAfterComma ?? 3))}
            </span>
            <span>{currency?.extras?.symbol}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
