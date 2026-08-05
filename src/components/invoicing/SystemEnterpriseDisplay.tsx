import { EnterpriseLogo } from '@/components/contacts/enterprise/EnterpriseLogo';
import { ResponseEnterpriseDto } from '@/types';
import { cn } from '@/lib/utils';

interface SystemEnterpriseDisplayProps {
  enterprise?: ResponseEnterpriseDto | null;
  className?: string;
}

export const SystemEnterpriseDisplay = ({
  enterprise,
  className
}: SystemEnterpriseDisplayProps) => {
  if (!enterprise) {
    return <span className={cn('text-sm text-muted-foreground', className)}>—</span>;
  }

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <EnterpriseLogo logoId={enterprise.logoId} name={enterprise.name} className="h-8 w-8" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium leading-tight">{enterprise.name}</span>
        {enterprise.taxId && (
          <span className="truncate text-xs text-muted-foreground">{enterprise.taxId}</span>
        )}
      </div>
    </div>
  );
};
