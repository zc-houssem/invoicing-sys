import { ResponseInvoiceDto } from './invoice';
import { ResponseEnterpriseDto, ResponseInterlocutorDto } from '../enterprise';
import { ResponseRefParamDto, CurrencyPayload } from '../reference-types';
import { DatabaseEntity } from '@/types/response/database-entity';
import { ResponseStorageDto } from '../storage';

export enum PAYMENT_MODE {
  Cash = 'Cash',
  Transfer = 'Transfer',
  Check = 'Check',
  CreditCard = 'CreditCard',
  Other = 'Other'
}

export enum PAYMENT_STATUS {
  Draft = 'Draft',
  Validated = 'Validated',
  Cancelled = 'Cancelled'
}

export interface CreatePaymentInvoiceEntryDto {
  invoiceId: number;
  amount: number;
}

export interface CreatePaymentUploadDto {
  uploadId?: number;
  order?: number;
}

export interface CreatePaymentDto {
  amount: number;
  fee?: number;
  convertionRate?: number;
  date: Date | null;
  mode: PAYMENT_MODE;
  notes?: string;
  enterpriseId: number;
  interlocutorId?: number;
  currencyId?: number;
  invoices: CreatePaymentInvoiceEntryDto[];
  uploads: CreatePaymentUploadDto[];
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}

export interface ResponsePaymentInvoiceEntryDto {
  id: number;
  paymentId: number;
  invoiceId: number;
  amount: number;
  invoice: ResponseInvoiceDto;
}

export interface ResponsePaymentUploadDto {
  id: number;
  paymentId: number;
  uploadId: number;
  upload: ResponseStorageDto;
}

export interface ResponsePaymentDto extends DatabaseEntity {
  id: number;
  status: string;
  amount: number;
  fee: number;
  convertionRate: number;
  date: Date;
  mode: string;
  notes?: string;
  enterprise: ResponseEnterpriseDto;
  enterpriseId: number;
  interlocutor: ResponseInterlocutorDto;
  interlocutorId: number;
  currency: ResponseRefParamDto<CurrencyPayload>;
  currencyId: number;
  invoices: ResponsePaymentInvoiceEntryDto[];
  uploads: ResponsePaymentUploadDto[];
}
