import { DatabaseEntity } from '../response/database-entity';

export interface LineArticle {
  clientId: string;
  id?: number;
  articleId?: number;
  title?: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  discountType?: 'rate' | 'fixed';
  discountValue: number;
  taxIds?: number[];
}

export interface ResponseArticleFamilyDto extends DatabaseEntity {
  id: number;
  title?: string;
  description?: string;
  articles?: ResponseArticleDto[];
}

export interface CreateArticleFamilyDto {
  title?: string;
  description?: string;
}

export interface UpdateArticleFamilyDto {
  title?: string;
  description?: string;
}

export interface ResponseArticleDto extends DatabaseEntity {
  id: number;
  title?: string;
  description?: string;
  articleFamily?: ResponseArticleFamilyDto;
  articleFamilyId?: number;
}

export interface CreateArticleDto {
  title?: string;
  description?: string;
  articleFamilyId?: number;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {}
