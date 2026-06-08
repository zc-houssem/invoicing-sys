import { DatabaseEntity } from '../response/database-entity';
import { ResponseStorageDto } from './storage';

export interface ResponseTemplateDto extends DatabaseEntity {
  id: string;
  name: string;
  templateType?: ResponseTemplateTypeDto;
  templateTypeId?: string;
  description?: string;
  document?: ResponseStorageDto;
  documentId?: number;
  variables?: object;
  backupVariables?: object;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  templateTypeId?: string;
  documentId?: number;
  variables?: string;
  backupVariables?: string;
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface ResponseTemplateTypeDto extends DatabaseEntity {
  id: string;
  code: string;
  name: string;
  variables?: any;
}

export interface CreateTemplateTypeDto {
  code: string;
  name: string;
  variables?: string;
}

export interface UpdateTemplateTypeDto extends Partial<CreateTemplateTypeDto> {}
