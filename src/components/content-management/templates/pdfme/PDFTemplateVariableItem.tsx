import { Checkbox } from '@/components/ui/checkbox';


interface PDFTemplateEditorVariableItemProps {
  className?: string;
  variable: any;
  isSelected: boolean;
  onToggle: (key: string) => void;
}

export const PDFTemplateEditorVariableItem = ({
  variable,
  isSelected,
  onToggle
}: PDFTemplateEditorVariableItemProps) => {
  return (
    <div
      className="flex items-center justify-between py-2 border-b last:border-0 group cursor-pointer"
      onClick={() => onToggle(variable.key)}>
      <div className="flex flex-col flex-1 pr-4">
        <span className="font-mono text-xs font-semibold">{variable.key}</span>
        <span className="text-xs text-muted-foreground mt-0.5">{variable.label}</span>
        <span className="text-xs text-muted-foreground mt-0.5">{variable.description}</span>
      </div>
      <Checkbox
        checked={isSelected}
        className="mr-2"
        onCheckedChange={() => onToggle(variable.key)}
      />
    </div>
  );
};
