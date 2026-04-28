import { DatabaseEntity } from '../response/database-entity';
import { ResponseStorageDto } from './storage';

export enum TemplateType {
  QUOTATION = 'quotation',
  INVOICE = 'invoice'
}

export interface ResponseTemplateDto extends DatabaseEntity {
  id: string;
  name: string;
  templateType?: TemplateType;
  description?: string;
  document?: ResponseStorageDto;
  documentId?: number;
  variables?: object;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  templateType?: TemplateType;
  documentId?: number;
  variables?: object;
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}
