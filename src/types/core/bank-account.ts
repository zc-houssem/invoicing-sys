import { DatabaseEntity } from '../response/database-entity';
import { CurrencyPayload, ResponseRefParamDto } from './reference-types';

export interface ResponseBankAccountDto extends DatabaseEntity {
  id: number;
  name: string;
  bic: string;
  rib: string;
  iban: string;
  currencyId: number;
  currency: ResponseRefParamDto<CurrencyPayload>;
  isMain: boolean;
}

export interface CreateBankAccountDto {
  name: string;
  bic: string;
  rib: string;
  iban: string;
  currencyId?: number;
  isMain?: boolean;
}

export interface UpdateBankAccountDto extends Partial<CreateBankAccountDto> {}
