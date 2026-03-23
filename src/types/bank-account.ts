import { ResponseCurrencyDto } from './currency';
import { DatabaseEntity } from './response/DatabaseEntity';

export interface ResponseBankAccountDto extends DatabaseEntity {
  id: number;
  name: string;
  bic: string;
  rib: string;
  iban: string;
  currencyId: number;
  currency: ResponseCurrencyDto;
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
