import { LineArticle } from '@/types/core/article';
import { BaseActions, createBaseStore } from './useBaseStore';
import { v4 as uuidv4 } from 'uuid';

interface ArticleData {
  articles: LineArticle[];
}

interface IArticleActions {
  addArticle: (article?: Partial<LineArticle>) => void;
  updateArticle: (id: string, article: Partial<LineArticle>) => void;
  deleteArticle: (id: string) => void;
}

export interface ArticleStore extends ArticleData, IArticleActions, BaseActions<ArticleData> {}

const initialState: ArticleData = {
  articles: [
    {
      id: uuidv4(),
      title: '',
      description: '',
      unitPrice: 0,
      quantity: 1
    }
  ]
};

export const useArticleStore = createBaseStore<ArticleStore>(initialState, (set, get) => ({
  addArticle(article?: Partial<LineArticle>) {
    const newArticle: LineArticle = {
      id: uuidv4(),
      title: article?.title || '',
      description: article?.description || '',
      unitPrice: article?.unitPrice || 0,
      quantity: article?.quantity || 1
    };
    set((state) => ({
      ...state,
      articles: [...state.articles, newArticle]
    }));
  },
  updateArticle(id: string, updatedArticle: Partial<LineArticle>) {
    set((state) => ({
      ...state,
      articles: state.articles.map((a) => (a.id === id ? { ...a, ...updatedArticle } : a))
    }));
  },
  deleteArticle(id: string) {
    set((state) => ({
      ...state,
      articles: state.articles.filter((a) => a.id !== id)
    }));
  }
}));
