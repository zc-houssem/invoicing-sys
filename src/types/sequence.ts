import { DateFormat } from './enums';
import { DatabaseEntity } from './response/database-entity';

export enum Sequences {
  INVOICE = 'invoice',
  QUOTATION = 'quotation'
}

export interface ResponseSequenceDto extends DatabaseEntity {
  id: number;
  type: Sequences;
  prefix: string;
  dateFormat: DateFormat;
  nextValue: number;
  padding: number;
}

export interface UpdateSequentialDto {
  prefix?: string;
  dateFormat?: DateFormat;
  nextValue?: number;
  padding?: number;
}
