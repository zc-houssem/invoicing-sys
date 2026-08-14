import { LineArticle } from '@/types/core/article';
import { BaseActions, createBaseStore } from './useBaseStore';
import { v4 as uuidv4 } from 'uuid';

interface ArticleData {
  articles: LineArticle[];
}

interface IArticleActions {
  addArticle: (article?: Partial<LineArticle>) => void;
  updateArticle: (clientId: string, article: Partial<LineArticle>) => void;
  deleteArticle: (clientId: string) => void;
}

export interface ArticleStore extends ArticleData, IArticleActions, BaseActions<ArticleData> {}

const initialState: ArticleData = {
  articles: [
    {
      clientId: uuidv4(),
      id: undefined,
      articleId: undefined,
      title: '',
      description: '',
      unitPrice: 0,
      quantity: 1,
      discountType: undefined,
      discountValue: 0,
      taxIds: []
    }
  ]
};

export const useArticleStore = createBaseStore<ArticleStore>(initialState, (set, get) => ({
  addArticle(article?: Partial<LineArticle>) {
    const newArticle: LineArticle = {
      clientId: uuidv4(),
      id: undefined,
      articleId: undefined,
      title: article?.title || '',
      description: article?.description || '',
      unitPrice: article?.unitPrice || 0,
      quantity: article?.quantity || 1,
      discountType: article?.discountType || 'rate',
      discountValue: article?.discountValue || 0,
      taxIds: article?.taxIds || []
    };
    set((state) => ({
      ...state,
      articles: [...state.articles, newArticle]
    }));
  },
  updateArticle(clientId: string, updatedArticle: Partial<LineArticle>) {
    set((state) => ({
      ...state,
      articles: state.articles.map((a) =>
        a.clientId === clientId ? { ...a, ...updatedArticle } : a
      )
    }));
  },
  deleteArticle(clientId: string) {
    set((state) => ({
      ...state,
      articles: state.articles.filter((a) => a.clientId !== clientId)
    }));
  }
}));
