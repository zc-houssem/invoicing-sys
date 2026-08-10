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
  previewPictureId?: number;
  previewPicture?: ResponseStorageDto;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  templateTypeId?: string;
  documentId?: number;
  variables?: string;
  backupVariables?: string;
  previewPictureId?: number;
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface ResponseTemplateHeaderDto extends DatabaseEntity {
  id: string;
  name: string;
  description?: string;
  ejsCode?: string;
  previewPicture?: ResponseStorageDto;
  previewPictureId?: number;
}

export interface CreateTemplateHeaderDto {
  name: string;
  description?: string;
  ejsCode?: string;
  previewPictureId?: number;
}

export interface UpdateTemplateHeaderDto extends Partial<CreateTemplateHeaderDto> {}

export interface ResponseTemplateFooterDto extends DatabaseEntity {
  id: string;
  name: string;
  description?: string;
  ejsCode?: string;
  previewPicture?: ResponseStorageDto;
  previewPictureId?: number;
}

export interface CreateTemplateFooterDto {
  name: string;
  description?: string;
  ejsCode?: string;
  previewPictureId?: number;
}

export interface UpdateTemplateFooterDto extends Partial<CreateTemplateFooterDto> {}

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
