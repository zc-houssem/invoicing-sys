import { ArticleManagement } from '../../articles/ArticleManagement';
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { ArticleItem } from '../../articles/ArticleItem';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';

interface InvoiceArticlesFieldProps {
  className?: string;
  currency?: ResponseRefParamDto<CurrencyPayload>;
  disabled?: boolean;
}

export const InvoiceArticlesField = ({
  className,
  currency,
  disabled
}: InvoiceArticlesFieldProps) => {
  const articleStore = useArticleStore();
  return (
    <div className={className}>
      <ArticleManagement
        articles={articleStore.articles}
        setArticles={(articles) => articleStore.set('articles', articles)}
        addArticle={() => articleStore.addArticle()}
        deleteArticle={articleStore.deleteArticle}
        disabled={disabled}
        renderArticleItem={(item, edit, index) => (
          <ArticleItem index={index} currency={currency} disabled={disabled} />
        )}
      />
    </div>
  );
};
