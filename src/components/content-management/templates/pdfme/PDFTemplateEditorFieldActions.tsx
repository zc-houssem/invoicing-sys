import React from 'react';
import { Expand, Package, PackageOpen, X, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { PDFTemplateEditorVariableItem } from './PDFTemplateVariableItem';
import { ResponseTemplateTypeDto } from '@/types';

interface PDFTemplateEditorFieldActionsProps {
  className?: string;
  toggle: () => void;
  exportCallback?: () => void;
  importCallback?: () => void;
  isFullscreen: boolean;
  templateType?: ResponseTemplateTypeDto;
  onInsertVariables?: (variableKeys: string[]) => void;
}

export const PDFTemplateEditorFieldActions = ({
  className,
  isFullscreen,
  exportCallback,
  importCallback,
  toggle,
  templateType,
  onInsertVariables
}: PDFTemplateEditorFieldActionsProps) => {
  const variables = (templateType?.variables || []) as any[];
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const toggleVariable = (key: string) => {
    setSelectedVariables((prev) =>
      prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
    );
  };

  const handleBatchInsert = () => {
    if (onInsertVariables && selectedVariables.length > 0) {
      onInsertVariables(selectedVariables);
      toast.success(`${selectedVariables.length} variable(s) inserted into template`);
      setSelectedVariables([]);
      setOpen(false);
    }
  };
  return (
    <div className={cn('flex flex-col lg:flex-row gap-2 bg-card p-2 rounded-lg', className)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant={'outline'} size={'sm'} className="ml-auto">
            <List className="size-4 mr-2" />
            <span className="font-bold"> Insert Variables</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[50vw]">
          <DialogHeader>
            <DialogTitle>Template Variables</DialogTitle>
            <DialogDescription>
              Select variables and click insert to automatically add fields to your template.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="flex flex-col">
              {variables.map((variable) => (
                <PDFTemplateEditorVariableItem
                  key={variable.key}
                  variable={variable}
                  isSelected={selectedVariables.includes(variable.key)}
                  onToggle={toggleVariable}
                />
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button disabled={selectedVariables.length === 0} onClick={handleBatchInsert}>
              <Plus className="size-4 mr-2" />
              Insert Selected ({selectedVariables.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
