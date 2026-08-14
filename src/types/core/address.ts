import { ResponseRefParamDto } from './reference-types';
import { DatabaseEntity } from '../response/database-entity';

export interface CountryExtras {
  alpha2Code: string;
  alpha3Code: string;
}

export interface ResponseAddressDto extends DatabaseEntity {
  id: number;
  address: string;
  address2: string;
  region: string;
  zipcode: number;
  country: ResponseRefParamDto<CountryExtras>;
  countryId: number;
}

export interface CreateAddressDto {
  address: string;
  address2?: string;
  region: string;
  zipcode?: number;
  countryId?: number;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
