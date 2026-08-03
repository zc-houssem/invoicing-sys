import { admin } from './admin';
import { agent } from './agent';
import { auth } from './auth';
import { upload } from './upload';
import { user } from './admin/users';
import { core } from './core';
import { invoicing } from './invoicing';
import { sequence } from './sequence';
import { defaultCondition } from './defaultCondition';
import { currentUser } from './current-user';

export const api = {
  admin,
  agent,
  auth,
  upload,
  user,
  currentUser,
  core,
  invoicing,
  sequence,
  defaultCondition
};
