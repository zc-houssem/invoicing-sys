import { DatabaseEntity } from '../response/database-entity';
import { CurrencyPayload, ResponseRefParamDto } from './reference-types';

export interface ResponseTaxRateDto extends DatabaseEntity {
  id: number;
  label: string;
  value: number;
  type: 'fixed' | 'rate';
  special: boolean;
  currencyId?: number;
  currency: ResponseRefParamDto<CurrencyPayload>;
}

export interface CreateTaxRateDto {
  label: string;
  value: number;
  type: 'rate' | 'fixed';
  special: boolean;
  currencyId?: number;
}

export interface UpdateTaxRateDto extends Partial<CreateTaxRateDto> {}
