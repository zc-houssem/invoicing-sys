import { DatabaseEntity } from '../response/database-entity';
import { PropertyChange } from './property-change';
import { ResponseUserDto } from './user-management';

export interface LogInfo extends Record<string, unknown> {
  changes?: PropertyChange[];
}

export interface LogEntry extends DatabaseEntity {
  id: number;
  event: string;
  title?: string;
  description?: string;
  api: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  user: ResponseUserDto;
  userId?: string;
  logInfo: LogInfo;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ResponseLogDto extends LogEntry {}
