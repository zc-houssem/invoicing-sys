import { DatabaseEntity } from '../response/database-entity';
import { ResponseUserDto } from './user-management';

export interface LogEntry extends DatabaseEntity {
  id: number;
  event: string;
  api: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  user: ResponseUserDto;
  userId?: string;
  logInfo: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ResponseLogDto extends LogEntry {}
