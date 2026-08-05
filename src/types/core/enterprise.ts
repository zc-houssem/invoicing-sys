import { DatabaseEntity } from '../response/database-entity';
import { CreateAddressDto, ResponseAddressDto } from './address';
import { ResponseRefParamDto } from './reference-types';
import { ResponseInvoiceDto } from './invoicing/invoice';
import { ResponseUserDto } from './user-management';

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
  logoId?: number;
  deliveryAddress?: ResponseAddressDto;
  deliveryAddressId?: number;
  invoicingAddress?: ResponseAddressDto;
  invoicingAddressId?: number;
  invoices?: ResponseInvoiceDto[];
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
  logoId?: number;
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
  enterpriseInterlocutors?: ResponseEnterpriseInterlocutorDto[];
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
  interlocutor?: CreateInterlocutorDto;
  interlocutorId?: number;
  enterpriseId?: number;
  main: boolean;
  position: string;
}

export interface UpdateEnterpriseInterlocutorDto extends Partial<CreateEnterpriseInterlocutorDto> {
  interlocutors?: UpdateInterlocutorDto;
}

// enterprise-member *******************************************************

export interface ResponseEnterpriseMemberDto extends DatabaseEntity {
  id: number;
  enterpriseId: number;
  userId: string;
  enterprise?: ResponseEnterpriseDto;
  user?: ResponseUserDto;
  isOwner: boolean;
}

export interface CreateEnterpriseMemberDto {
  enterpriseId?: number;
  userId: string;
  isOwner?: boolean;
}

export interface UpdateEnterpriseMemberDto extends Partial<CreateEnterpriseMemberDto> {}
