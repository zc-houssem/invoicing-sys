import { ResponseEnterpriseDto, ResponseInterlocutorDto } from './enterprise';
import { DatabaseEntity } from '../response/DatabaseEntity';
import { CreateArticleDto, ResponseArticleDto } from './article';

export interface ResponseQuotationDto extends DatabaseEntity {
  id: number;
  status: string;
  direction: 'incoming' | 'outgoing';
  date: Date;
  dueDate: Date;
  object: string;
  generalConditions: string;
  enterprise: ResponseEnterpriseDto;
  enterpriseId: number;
  interlocutor: ResponseInterlocutorDto;
  interlocutorId: number;
  quotationArticles: ResponseQuotationArticleDto[];
}

export interface CreateQuotationDto {
  direction: 'incoming' | 'outgoing';
  date: Date | null;
  dueDate: Date | null;
  object: string;
  generalConditions?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  quotationArticles: CreateQuotationArticleDto[];
}

export interface UpdateQuotationDto extends Partial<CreateQuotationDto> {}

export interface ResponseQuotationArticleDto extends DatabaseEntity {
  id: number;
  quotation: ResponseQuotationDto;
  quotationId: number;

  article: ResponseArticleDto;
  articleId: number;

  unitPrice: number;
  quantity: number;
}

export interface CreateQuotationArticleDto {
  article?: CreateArticleDto;
  unitPrice: number;
  quantity: number;
}

export interface UpdateQuotationArticleDto extends Partial<CreateQuotationArticleDto> {}
