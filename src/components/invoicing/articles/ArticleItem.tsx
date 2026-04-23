import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { useArticleItemFormStructure } from './useArticleItemFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
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
}

export function ArticleItem({ className, index, currency, disabled }: ArticleItemProps) {
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
    disabled
  });

  const totalPriceExcludingTax = React.useMemo(() => {
    const article = articleStore.articles[index];
    return article.quantity * article.unitPrice;
  }, [articleStore.articles[index].quantity, articleStore.articles[index].unitPrice]);

  const totalPriceIncludingTax = React.useMemo(() => {
    const article = articleStore.articles[index];
    let finalPrice = totalPriceExcludingTax;

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

    return finalPrice;
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
    <div className={cn('flex flex-row gap-4 justify-between items-center p-2', className)}>
      <FormBuilder structure={structure} />
      <div className="flex flex-col justify-between items-baseline p-4 w-56 gap-6">
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.priceExcludingTax')}: </span>
          <span className="flex gap-1 font-light">
            <span>{totalPriceExcludingTax.toFixed(currency?.extras.digitsAfterComma ?? 2)}</span>
            <span>{currency?.extras.symbol}</span>
          </span>
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-bold">{t('article.form.priceIncludingTax')}: </span>
          <span className="flex gap-1 font-light">
            <span>{totalPriceIncludingTax.toFixed(currency?.extras.digitsAfterComma ?? 2)}</span>
            <span>{currency?.extras.symbol}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
