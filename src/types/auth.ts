import { ResponseUserDto } from './user';

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface ResponseSigninDto {
  user: ResponseUserDto;
  access_token: string;
  refresh_token: string;
}

export interface ResponseSignupDto {
  user: ResponseUserDto;
}

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface SignupPayload {
  // your signup payload fields
  username: string;
  email: string;
  password: string;
}
