import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { useArticleItemFormStructure } from './useArticleItemFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';

interface ArticleItemProps {
  className?: string;
  index: number;
}

export function ArticleItem({ className, index }: ArticleItemProps) {
  const articleStore = useArticleStore();
  const structure = useArticleItemFormStructure({
    store: articleStore,
    index
  });

  const totalPrice = React.useMemo(() => {
    const article = articleStore.articles[index];
    return article.quantity * article.unitPrice;
  }, [articleStore.articles[index].quantity, articleStore.articles[index].unitPrice]);

  return (
    <div className={cn('flex flex-row gap-4 justify-center items-center p-2', className)}>
      <FormBuilder structure={structure} />
      <div className="px-4 w-36">
        <Label>
          <span className="font-bold">Total Price: </span>
          <span className="font-light">{totalPrice}</span>
        </Label>
      </div>
    </div>
  );
}
