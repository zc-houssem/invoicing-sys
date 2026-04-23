import { DatabaseEntity } from './response/database-entity';

export interface Country extends DatabaseEntity {
  id?: number;
  alpha2Code?: string;
  alpha3Code?: string;
}
