import { DatabaseEntity } from '../response/database-entity';
import { CreateAddressDto, ResponseAddressDto } from './address';
import { ResponseRefParamDto } from './reference-types';

// enterprise *******************************************************
export interface ResponseEnterpriseDto extends DatabaseEntity {
  id: number;
  name: string;
  phone: string;
  website?: string;
  particular: boolean;
  taxId?: string;
  notes?: string;
  system?: boolean;
  activityId?: number;
  activity?: ResponseRefParamDto;
  currencyId?: number;
  currency?: ResponseRefParamDto;
  paymentConditionId?: number;
  paymentCondition?: ResponseRefParamDto;
  deliveryAddress?: ResponseAddressDto;
  deliveryAddressId?: number;
  invoicingAddress?: ResponseAddressDto;
  invoicingAddressId?: number;
}

export interface CreateEnterpriseDto {
  name: string;
  phone: string;
  website?: string;
  particular?: boolean;
  taxId: string;
  notes?: string;
  system?: boolean;
  activityId?: number;
  currencyId?: number;
  paymentConditionId?: number;
  deliveryAddress: CreateAddressDto;
  invoicingAddress: CreateAddressDto;
  interlocutors?: CreateEnterpriseInterlocutorDto[];
}

export interface UpdateEnterpriseDto extends Partial<CreateEnterpriseDto> {}

// interlocutor *******************************************************
export enum SocialTitles {
  MR = 'Mr.',
  MRS = 'Mrs.',
  MISS = 'Miss',
  MS = 'Ms.',
  DR = 'Dr.',
  PROF = 'Prof.'
}

export interface ResponseInterlocutorDto extends DatabaseEntity {
  id: number;
  title: SocialTitles;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  enterprises?: ResponseEnterpriseInterlocutorDto[];
}

export interface CreateInterlocutorDto {
  title: SocialTitles;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface UpdateInterlocutorDto extends Partial<CreateInterlocutorDto> {}

// enterprise-interlocutor *******************************************************

export interface ResponseEnterpriseInterlocutorDto extends DatabaseEntity {
  id: number;
  enterpriseId: number;
  interlocutorId: number;
  enterprise?: ResponseEnterpriseDto;
  interlocutor?: ResponseInterlocutorDto;
  main: boolean;
  position: string;
}

export interface CreateEnterpriseInterlocutorDto {
  interlocutor: CreateInterlocutorDto;
  main: boolean;
  position: string;
}

export interface UpdateEnterpriseInterlocutorDto extends Partial<CreateEnterpriseInterlocutorDto> {
  interlocutors?: UpdateInterlocutorDto;
}
