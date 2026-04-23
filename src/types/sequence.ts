import { DateFormat } from './enums';
import { DatabaseEntity } from './response/database-entity';

export enum Sequences {
  INVOICE = 'invoice',
  QUOTATION = 'quotation'
}

export interface ResponseSequenceDto extends DatabaseEntity {
  id: number;
  label: string;
  prefix: string;
  dateFormat: DateFormat;
  next: number;
}

export interface UpdateSequentialDto {
  prefix?: string;
  dateFormat?: DateFormat;
  next?: number;
}
