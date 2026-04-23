import { cn } from '@/lib/utils';

interface StatusProps {
  className?: string;
  status: string;
}

export const Status = ({ className, status }: StatusProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <span className="font-bold">Status:</span>
      <span className="text-muted-foreground">{status}</span>
    </div>
  );
};
