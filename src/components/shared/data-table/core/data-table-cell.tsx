import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { DataTableCellVariant } from '../types';

interface DataTableCellProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  variant?: DataTableCellVariant;
}

export default function DataTableCell({ className, variant, value }: DataTableCellProps) {
  if (variant === DataTableCellVariant.TEXT) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.NUMBER) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.DATE) {
    if (!value) return <div className={className}>No Date</div>;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return <div className={className} />;
    return <div className={className}>{date.toLocaleDateString()}</div>;
  } else if (variant === DataTableCellVariant.DATE_TIME) {
    if (!value) return <div className={className}>No Date</div>;
    return (
      <div className="flex items-start flex-col">
        <div>{value?.toLocaleDateString()}</div>
        <div className="text-muted-foreground">{value?.toLocaleTimeString()}</div>
      </div>
    );
  } else if (variant === DataTableCellVariant.AVATAR) {
    return (
      <Avatar className={cn('w-24 h-24', className)}>
        <AvatarImage src={value?.url} />
        <AvatarFallback>{value?.fallback}</AvatarFallback>
      </Avatar>
    );
  }
}
