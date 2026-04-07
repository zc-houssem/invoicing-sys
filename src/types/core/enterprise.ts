import { DatabaseEntity } from '../response/DatabaseEntity';

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
}

export interface CreateEnterpriseDto {
  name: string;
  phone: string;
  website?: string;
  particular?: boolean;
  taxId: string;
  notes?: string;
  system?: boolean;
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
  enterprise: ResponseEnterpriseDto;
  interlocutor: ResponseInterlocutorDto;
  main: boolean;
  position: string;
}
