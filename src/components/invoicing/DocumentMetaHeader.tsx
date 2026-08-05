import { ResponseEnterpriseDto, ResponseUserDto } from '@/types';
import { CreatedByDisplay } from './CreatedByDisplay';
import { DocumentMetaTable, MetaTableRow } from './DocumentMetaTable';
import { SystemEnterpriseDisplay } from './SystemEnterpriseDisplay';

export interface DocumentMetaHeaderProps {
  className?: string;
  statusLabel?: string;
  status: string;
  createdByLabel: string;
  user?: ResponseUserDto | null;
  systemEnterpriseLabel?: string;
  systemEnterprise?: ResponseEnterpriseDto | null;
  extraRows?: MetaTableRow[];
}

export const DocumentMetaHeader = ({
  className,
  statusLabel = 'Status',
  status,
  createdByLabel,
  user,
  systemEnterpriseLabel,
  systemEnterprise,
  extraRows = []
}: DocumentMetaHeaderProps) => {
  const rows: MetaTableRow[] = [
    { label: statusLabel, value: status },
    { label: createdByLabel, value: <CreatedByDisplay user={user} /> },
    ...(systemEnterpriseLabel
      ? [
          {
            label: systemEnterpriseLabel,
            value: <SystemEnterpriseDisplay enterprise={systemEnterprise} />
          }
        ]
      : []),
    ...extraRows
  ];

  return <DocumentMetaTable rows={rows} className={className} />;
};
