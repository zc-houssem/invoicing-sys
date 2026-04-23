import { DatabaseEntity } from './response/database-entity';

export interface Permission extends DatabaseEntity {
  id?: number;
  label?: string;
  description?: string;
}
