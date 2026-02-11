import { DatabaseEntity } from './response/DatabaseEntity';
import { Role } from './role';
import { Upload } from './upload';

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
  // role: ResponseRoleDto;
  // roleId: string;
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

//***********************************************************************************************

export interface UserPreferences {
  font?: string;
  theme?: string;
}

export interface ResponseUserDto {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  role?: Role;
  roleId?: number;
  picture?: Upload;
  pictureId?: number;
  isActive?: boolean;
  isApproved?: boolean;
}
