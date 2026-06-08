import React, { useState } from 'react';
import { useDialog } from '@/components/shared/Dialogs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PDFTemplateEditorVariableItem } from './PDFTemplateVariableItem';

interface UsePDFTemplateVariableDialogProps {
  variables: any[];
  onInsertVariables?: (variableKeys: string[]) => void;
}

export const usePDFTemplateVariableDialog = ({
  variables,
  onInsertVariables
}: UsePDFTemplateVariableDialogProps) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

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
      closeDialog();
    }
  };

  const resetSelection = () => {
    setSelectedVariables([]);
  };

  const { DialogFragment, openDialog, closeDialog } = useDialog({
    title: 'Template Variables',
    description: 'Select variables and click insert to automatically add fields to your template.',
    className: 'sm:max-w-[500px]',
    onToggle: resetSelection,
    children: (
      <React.Fragment>
        <ScrollArea className="max-h-[400px] pr-4">
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
      </React.Fragment>
    )
  });

  return {
    variableDialog: DialogFragment,
    openVariableDialog: openDialog,
    closeVariableDialog: closeDialog
  };
};
