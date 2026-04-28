import { Expand, Package, PackageOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PDFTemplateEditorFieldActionsProps {
  className?: string;
  toggle: () => void;
  exportCallback?: () => void;
  importCallback?: () => void;
  isFullscreen: boolean;
}

export const PDFTemplateEditorFieldActions = ({
  className,
  isFullscreen,
  exportCallback,
  importCallback,
  toggle
}: PDFTemplateEditorFieldActionsProps) => {
  return (
    <div className={cn('flex flex-col lg:flex-row gap-2', className)}>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={toggle}>
        {isFullscreen ? <X className="size-6" /> : <Expand className="size-6" />}
        {!isFullscreen && <span className="font-bold">Expand</span>}
      </Button>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={exportCallback}>
        <Package />
        <span className="font-bold">Export</span>
      </Button>
      <Button type="button" variant={'ghost'} size={'sm'} onClick={importCallback}>
        <PackageOpen />
        <span className="font-bold">Import</span>
      </Button>
    </div>
  );
};
