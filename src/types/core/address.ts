import { ResponseRefParamDto } from './reference-types';
import { DatabaseEntity } from '../response/DatabaseEntity';

export interface ResponseAddressDto extends DatabaseEntity {
  id: number;
  address: string;
  address2: string;
  region: string;
  zipcode: number;
  country: ResponseRefParamDto;
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
