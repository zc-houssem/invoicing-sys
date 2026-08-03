import { cn } from '@/lib/utils';

interface StatusProps {
  className?: string;
  status: string;
  children?: React.ReactNode;
}

export const Status = ({ className, status, children }: StatusProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div className="flex items-center gap-2">
        <span className="font-bold">Status:</span>
        <span className="text-muted-foreground">{status}</span>
      </div>
      {children}
    </div>
  );
};
