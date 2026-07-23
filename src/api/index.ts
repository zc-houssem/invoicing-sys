import { admin } from './admin';
export * from './admin';
import { agent } from './agent';
export * from './agent';
import { auth } from './auth';
export * from './auth';

import { appConfig } from './app-config';
export * from './app-config';

import { cabinet } from './cabinet';
export * from './cabinet';
import { defaultCondition } from './default-condition';
export * from './default-condition';

import { invoice } from './invoice';
export * from './invoice';
import { payment } from './payment';
export * from './payment';

import { sequence } from './sequence';
export * from './sequence';
import { tax } from './tax';
export * from './tax';
import { upload } from './upload';
export * from './upload';
import { user } from './admin/users';
export * from './admin/users';

export * from '../types/response';
export * from '../types/enums';

import { core } from './core';
export * from './core';
import { invoicing } from './invoicing';

export const api = {
  admin,
  agent,
  auth,
  appConfig,
  cabinet,
  defaultCondition,
  invoice,
  payment,
  sequence,
  tax,
  upload,
  user,
  core,
  invoicing
};
