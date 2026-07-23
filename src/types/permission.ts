import { DatabaseEntity } from './response/database-entity';

export interface Permission extends DatabaseEntity {
  id?: string;
  label?: string;
  description?: string;
}
