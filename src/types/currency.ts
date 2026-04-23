import { DatabaseEntity } from './response/database-entity';

export interface ResponseCurrencyDto extends DatabaseEntity {
  id: number;
  label: string;
  code: string;
  symbol?: string;
  digitAfterComma?: number;
}
