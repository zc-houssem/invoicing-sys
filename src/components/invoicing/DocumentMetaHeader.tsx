import { ResponseUserDto } from '@/types';
import { CreatedByDisplay } from './CreatedByDisplay';
import { DocumentMetaTable, MetaTableRow } from './DocumentMetaTable';

export interface DocumentMetaHeaderProps {
  className?: string;
  statusLabel?: string;
  status: string;
  createdByLabel: string;
  user?: ResponseUserDto | null;
  extraRows?: MetaTableRow[];
}

export const DocumentMetaHeader = ({
  className,
  statusLabel = 'Status',
  status,
  createdByLabel,
  user,
  extraRows = []
}: DocumentMetaHeaderProps) => {
  const rows: MetaTableRow[] = [
    { label: statusLabel, value: status },
    { label: createdByLabel, value: <CreatedByDisplay user={user} /> },
    ...extraRows
  ];

  return <DocumentMetaTable rows={rows} className={className} />;
};
