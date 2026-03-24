import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

interface QuotationCreateFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationCreateFormProps) => {
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden py-4', className)}>
      <ResizablePanelGroup orientation="horizontal" className=" rounded-lg border">
        <ResizablePanel defaultSize="75%">
          <div className="flex items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="25%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Two</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
