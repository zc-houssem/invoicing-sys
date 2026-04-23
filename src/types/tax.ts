import { Currency } from './currency';
import { PagedResponse } from './response';
import { DatabaseEntity } from './response/database-entity';

export interface Tax extends DatabaseEntity {
  id?: number;
  label?: string;
  value?: number;
  isRate?: boolean;
  isSpecial?: boolean;
  currency?: Currency;
  currencyId?: number | null;
}

export interface CreateTaxDto
  extends Omit<Tax, 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'> {}
export interface UpdateTaxDto extends CreateTaxDto {
  id?: number;
}
export interface PagedTax extends PagedResponse<Tax> {}
