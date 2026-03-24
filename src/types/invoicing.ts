import { DatabaseEntity } from './response/DatabaseEntity';

export interface ResponseQuotationDto extends DatabaseEntity {
  id: number;
  direction: 'incoming' | 'outgoing';
  date: Date;
  dueDate: Date;
  object: string;
  generalConditions: string;
}

export interface CreateQuotationDto {
  direction: 'incoming' | 'outgoing';
  date: Date | null;
  dueDate: Date | null;
  object: string;
  generalConditions?: string;
}

export interface UpdateQuotationDto extends Partial<CreateQuotationDto> {}
