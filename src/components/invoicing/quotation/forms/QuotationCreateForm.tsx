import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { use } from 'react';
import { useQuotationCreateFormStructure } from './useQuotationCreateFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useMutation } from '@tanstack/react-query';
import { api, ServerErrorResponse } from '@/api';
import { toast } from 'sonner';
import { create } from 'lodash';
import { createDraftQuotationSchema } from '@/types/validations/quotation.validation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface QuotationCreateFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationCreateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const quotationStore = useQuotationStore();

  const { mutate: createQuotation, isPending: isCreationPending } = useMutation({
    mutationFn: async () => api.invoicing.quotation.create(quotationStore.createDto),
    onSuccess: (data) => {
      quotationStore.reset();
      toast.success('Quotation created successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.message || 'An error occurred while creating the quotation.');
    }
  });

  const handleSubmit = () => {
    const result = createDraftQuotationSchema.safeParse(quotationStore.createDto);

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      quotationStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    createQuotation();
  };

  const { mainFormStructure, sidebarFormStructure } = useQuotationCreateFormStructure({
    store: quotationStore,
    createQuotation: handleSubmit,
    isCreationPending
  });

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden py-4', className)}>
      <ResizablePanelGroup
        orientation={isMobile ? 'vertical' : 'horizontal'}
        className=" rounded-lg border">
        <ResizablePanel defaultSize={isMobile ? '100%' : '75%'}>
          <div className="flex items-center justify-center p-6">
            <FormBuilder structure={mainFormStructure} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={isMobile ? '0%' : '25%'}
          minSize={isMobile ? '0%' : '20%'}
          maxSize={isMobile ? '0%' : '30%'}>
          <div className="flex h-full items-start justify-center p-6">
            <FormBuilder structure={sidebarFormStructure} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
