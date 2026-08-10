import { enterprise } from './enterprise';
import { interlocutor } from './interlocutor';
import { enterpriseInterlocutor } from './enterprise-interlocutor';
import { enterpriseMember } from './enterprise-member';
import { articleFamily } from './article-family';
import { article } from './article';
import { bankAccount } from './bank-account';
import { taxRate } from './tax-rate';
import { template } from './template';
import { storage } from './storage';
import { templateType } from './template-type';
import { templateHeader } from './template-header';
import { templateFooter } from './template-footer';
import { documentPdf } from './document-pdf';

export const core = {
  article,
  articleFamily,
  bankAccount,
  enterprise,
  interlocutor,
  enterpriseInterlocutor,
  enterpriseMember,
  taxRate,
  template,
  templateType,
  templateHeader,
  templateFooter,
  storage,
  documentPdf
};
