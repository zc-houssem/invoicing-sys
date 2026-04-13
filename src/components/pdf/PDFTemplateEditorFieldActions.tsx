import { Expand, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface PDFTemplateEditorFieldActionsProps {
  className?: string;
  toggle: () => void;
  isFullscreen: boolean;
}

export const PDFTemplateEditorFieldActions = ({
  className,
  isFullscreen,
  toggle
}: PDFTemplateEditorFieldActionsProps) => {
  return (
    <div className={cn('flex flex-col lg:flex-row gap-2', className)}>
      <Button type="button" variant={'ghost'} size={'lg'} className="h-12" onClick={toggle}>
        {isFullscreen ? <X className="size-6" /> : <Expand className="size-6" />}
        {!isFullscreen && <span className="font-bold">Expand</span>}
      </Button>
    </div>
  );
};
