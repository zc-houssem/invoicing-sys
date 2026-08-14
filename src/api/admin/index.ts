import { logger } from './logger';
import { refParam } from './ref-param';
import { refType } from './ref-type';
import { configuration } from './configuration';
import { user } from './users';
import { role } from './roles';
import { permission } from './permission';

export const admin = {
  refType,
  refParam,
  logger,
  configuration,
  user,
  role,
  permission
};
