import { DatabaseEntity } from './response/database-entity';

export enum Sequences {
  INVOICE = 'invoice',
  QUOTATION = 'quotation'
}

export enum DateFormat {
  YYYY = 'yyyy',
  YYMM = 'yy/MM',
  YYYYMM = 'yyyy/MM'
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

export interface BatchUpdateSequenceItemDto extends UpdateSequentialDto {
  type: Sequences;
}

export interface BatchUpdateSequenceDto {
  sequences: BatchUpdateSequenceItemDto[];
}
