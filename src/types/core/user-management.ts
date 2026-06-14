import { DatabaseEntity } from '../response/database-entity';
import { Upload } from '../upload';
import { ResponseRefParamDto } from './reference-types';

//abstract user dtos *****************************************************************************

export interface ResponseAbstractUserDto extends DatabaseEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  username: string;
  email: string;
  emailVerified?: Date;
  role: ResponseRoleDto;
  roleId: string;
}

export interface CreateAbstractUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  isApproved?: boolean;
  password?: string;
  username: string;
  email: string;
  roleId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateAbstractUserDto extends Partial<CreateAbstractUserDto> {}

// user dtos ************************************************************************************

export interface ResponseUserDto extends ResponseAbstractUserDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  pictureId?: number;
  coverId?: number;
  picture?: Upload;
  officialDocumentId?: number;
  officialDocument?: Upload;
  driverLicenseDocumentId?: number;
  driverLicenseDocument?: Upload;
  uploads: ResponseUserUploadDto[];
  industries: ResponseRefParamDto[];
  objectives: ResponseRefParamDto[];
}

export interface CreateUserDto extends CreateAbstractUserDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  pictureId?: number;
  coverId?: number;
  officialDocumentId?: number;
  driverLicenseDocumentId?: number;
  uploads?: { uploadId: number }[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseUserUploadDto extends DatabaseEntity {
  id: number;
  userId: string;
  user: ResponseUserDto;
  uploadId: number;
  upload: Upload;
  order: number;
}

// ********************************************************************************************

export interface ResponseRoleDto extends DatabaseEntity {
  id: string;
  label: string;
  description?: string;
  permissions: ResponseRolePermissionDto[];
}

export interface ResponseRolePermissionDto {
  id: number;
  role?: ResponseRoleDto;
  roleId: string;
  permission?: ResponsePermissionDto;
  permissionId: string;
}

export interface CreateRoleDto {
  label: string;
  description?: string;
  permissions: { permissionId: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateRoleDto extends Partial<CreateRoleDto> {}

export interface ResponsePermissionDto extends DatabaseEntity {
  id: string;
  label: string;
  description?: string;
  roles?: ResponseRolePermissionDto[];
}

export interface RequestResetTokenDto {
  usernameOrEmail: string;
}

export interface ResponseResetTokenDto {
  email: string;
  success: boolean;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum WorkTypes {
  FULL_TIME = 'Full-Time',
  PART_TIME = 'Part-Time',
  TEMPORARY = 'Temporary',
  INTERN = 'Internship',
  FREELANCE = 'Freelance',
  VOLUNTEER = 'Volunteer',
  APPRENTICESHIP = 'Apprenticeship'
}

export enum LocationTypes {
  REMOTE = 'Remote',
  ON_SITE = 'On-Site',
  HYBRID = 'Hybrid'
}

export interface ResponseFollowDto extends DatabaseEntity {
  id: string;
  follower: ResponseUserDto;
  followerId: string;
  following: ResponseUserDto;
  followingId: string;
  isFollowing: boolean;
}

export interface ResponseFollowCountsDto {
  followers: number;
  following: number;
}

export interface ResponseIsFollowingDto {
  userId?: string;
  targetId?: string;
  isFollowing?: boolean;
}

// user experience dtos ************************************************************************************
export interface ResponseExperienceDto extends DatabaseEntity {
  id: number;
  title?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  locationType?: LocationTypes;
  workType?: WorkTypes;
  user?: ResponseUserDto;
  userId: string;
}

export interface CreateExperienceDto {
  title?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  locationType?: LocationTypes;
  workType?: WorkTypes;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}

// user education dtos ************************************************************************************

export interface ResponseEducationDto extends DatabaseEntity {
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  institution?: string;
  description?: string;
  user?: ResponseUserDto;
  userId: string;
}

export interface CreateEducationDto {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  institution?: string;
  description?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateEducationDto extends Partial<CreateEducationDto> {}
