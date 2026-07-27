import { ResponseEnterpriseDto, ResponseInterlocutorDto } from '../enterprise';
import { DatabaseEntity } from '../../response/database-entity';
import { CreateArticleDto, ResponseArticleDto, UpdateArticleDto } from '../article';
import { ResponseRefParamDto } from '../reference-types';
import { ResponseBankAccountDto } from '../bank-account';
import { ResponseTaxRateDto } from '../tax-rate';
import { ResponseWorkflowDto } from '../../response/workflow';
import { ResponseStorageDto } from '../storage';

export interface ResponseInvoiceDto extends DatabaseEntity {
  id: number;
  sequential?: string;
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
  taxWithholding: ResponseRefParamDto;
  taxWithholdingId: number;
  bankAccount: ResponseBankAccountDto;
  bankAccountId: number;
  notes?: string;
  invoiceArticles: ResponseInvoiceArticleDto[];
  uploads: ResponseInvoiceUploadDto[];
}

export interface ResponseInvoiceWorkflowDto extends ResponseWorkflowDto {
  invoice: ResponseInvoiceDto;
  isPrintable: boolean;
}

export interface CreateInvoiceDto {
  direction: 'incoming' | 'outgoing';
  date: Date | null;
  dueDate: Date | null;
  object: string;
  generalConditions?: string;
  enterpriseId?: number;
  interlocutorId?: number;
  currencyId?: number;
  taxWithholdingId?: number;
  bankAccountId?: number;
  notes?: string;
  invoiceArticles: CreateInvoiceArticleDto[];
  uploads: CreateInvoiceUploadDto[];
}

export interface UpdateInvoiceDto
  extends Partial<Omit<CreateInvoiceDto, 'invoiceArticles' | 'uploads'>> {
  invoiceArticles: UpdateInvoiceArticleDto[];
  uploads: UpdateInvoiceUploadDto[];
}

export interface ResponseInvoiceArticleDto extends DatabaseEntity {
  id: number;
  invoice: ResponseInvoiceDto;
  invoiceId: number;

  article: ResponseArticleDto;
  articleId: number;

  order: number;

  unitPrice: number;
  quantity: number;

  discountType: 'rate' | 'fixed';
  discountValue: number;
  taxes: ResponseTaxRateDto[];
}

export interface CreateInvoiceArticleDto {
  article?: CreateArticleDto;
  unitPrice: number;
  quantity: number;
  order: number;
  discountType?: 'rate' | 'fixed';
  discountValue: number;
  taxIds?: number[];
}

export interface UpdateInvoiceArticleDto extends Partial<Omit<CreateInvoiceArticleDto, 'article'>> {
  id: number;
  articleId?: number;
  order?: number;
  article?: UpdateArticleDto;
  discountType?: 'rate' | 'fixed';
  discountValue: number;
  taxIds?: number[];
}

export interface ResponseInvoiceUploadDto extends DatabaseEntity {
  id: number;
  invoice: ResponseInvoiceDto;
  invoiceId: number;

  upload: ResponseStorageDto;
  uploadId: number;

  order: number;
}

export interface CreateInvoiceUploadDto {
  uploadId?: number;
  order: number;
}

export interface UpdateInvoiceUploadDto extends Partial<Omit<CreateInvoiceUploadDto, 'upload'>> {
  id: number;
  uploadId?: number;
  order?: number;
}
