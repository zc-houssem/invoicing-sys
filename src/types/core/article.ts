import { DatabaseEntity } from '../response/DatabaseEntity';

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
