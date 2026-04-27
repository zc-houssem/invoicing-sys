import { DatabaseEntity } from '../response/database-entity';

export interface ResponseStorageDto extends DatabaseEntity {
  id: number;
  slug: string;
  filename: string;
  mimeType: string;
  size: number;
  isTemporary: boolean;
}
