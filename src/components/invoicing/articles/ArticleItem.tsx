import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { useArticleItemFormStructure } from './useArticleItemFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';
import { useTranslation } from 'react-i18next';

interface ArticleItemProps {
  className?: string;
  index: number;
  currency?: ResponseRefParamDto<CurrencyPayload>;
}

export function ArticleItem({ className, index, currency }: ArticleItemProps) {
  const { t } = useTranslation('invoicing');
  const articleStore = useArticleStore();
  const structure = useArticleItemFormStructure({
    store: articleStore,
    index
  });

  const totalPriceExcludingTax = React.useMemo(() => {
    const article = articleStore.articles[index];
    return article.quantity * article.unitPrice;
  }, [articleStore.articles[index].quantity, articleStore.articles[index].unitPrice]);

  const totalPriceIncludingTax = React.useMemo(() => {
    const article = articleStore.articles[index];
    if (article.discountType === 'fixed') {
      return totalPriceExcludingTax - article.discountValue;
    }
    return totalPriceExcludingTax * (1 - article.discountValue / 100);
  }, [
    totalPriceExcludingTax,
    articleStore.articles[index].discountType,
    articleStore.articles[index].discountValue
  ]);

  return (
    <div className={cn('flex flex-row gap-4 justify-center items-center p-2', className)}>
      <FormBuilder structure={structure} />
      <div className="flex flex-col justify-between items-baseline px-4 w-32 gap-6">
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
