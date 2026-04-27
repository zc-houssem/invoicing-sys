import { ResponseEnterpriseDto, ResponseInterlocutorDto } from './enterprise';
import { DatabaseEntity } from '../response/database-entity';
import { CreateArticleDto, ResponseArticleDto, UpdateArticleDto } from './article';
import { ResponseRefParamDto } from './reference-types';
import { ResponseBankAccountDto } from './bank-account';
import { ResponseTaxRateDto } from './tax-rate';
import { ResponseWorkflowDto } from '../response/workflow';

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
  currency: ResponseRefParamDto;
  currencyId: number;
  bankAccount: ResponseBankAccountDto;
  bankAccountId: number;
  quotationArticles: ResponseQuotationArticleDto[];
}

export interface ResponseQuotationWorkflowDto extends ResponseWorkflowDto {
  quotation: ResponseQuotationDto;
  isPrintable: boolean;
}

export interface CreateQuotationDto {
  direction: 'incoming' | 'outgoing';
  date: Date | null;
  dueDate: Date | null;
  object: string;
  generalConditions?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  currencyId?: number;
  bankAccountId?: number;
  quotationArticles: CreateQuotationArticleDto[];
}

export interface UpdateQuotationDto extends Partial<Omit<CreateQuotationDto, 'quotationArticles'>> {
  quotationArticles: UpdateQuotationArticleDto[];
}

export interface ResponseQuotationArticleDto extends DatabaseEntity {
  id: number;
  quotation: ResponseQuotationDto;
  quotationId: number;

  article: ResponseArticleDto;
  articleId: number;

  unitPrice: number;
  quantity: number;

  discountType: 'rate' | 'fixed';
  discountValue: number;
  taxes: ResponseTaxRateDto[];
}

export interface CreateQuotationArticleDto {
  article?: CreateArticleDto;
  unitPrice: number;
  quantity: number;
  discountType?: 'rate' | 'fixed';
  discountValue: number;
  taxIds?: number[];
}

export interface UpdateQuotationArticleDto
  extends Partial<Omit<CreateQuotationArticleDto, 'article'>> {
  id: number;
  articleId?: number;
  article?: UpdateArticleDto;
}
