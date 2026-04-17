import { ArticleManagement } from '../../articles/ArticleManagement';
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { ArticleItem } from '../../articles/ArticleItem';

interface QuotationArticlesFieldProps {
  className?: string;
}

export const QuotationArticlesField = ({ className }: QuotationArticlesFieldProps) => {
  const articleStore = useArticleStore();
  return (
    <div className={className}>
      <ArticleManagement
        articles={articleStore.articles}
        setArticles={(articles) => articleStore.set('articles', articles)}
        addArticle={() => articleStore.addArticle()}
        deleteArticle={articleStore.deleteArticle}
        disabled={false}
        renderArticleItem={(item, edit, index) => <ArticleItem index={index} />}
      />
    </div>
  );
};
