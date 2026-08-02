import { Sequences } from './sequence';

export interface DefaultCondition {
  id: number;
  enterpriseId: number;
  document_type: Sequences;
  value: string;
}

export type UpdateDefaultConditionDto = Partial<DefaultCondition>;
