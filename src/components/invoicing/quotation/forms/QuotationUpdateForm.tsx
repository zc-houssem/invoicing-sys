import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useMutation } from '@tanstack/react-query';
import { api, ServerErrorResponse } from '@/api';
import { toast } from 'sonner';
import { createDraftQuotationSchema } from '@/types/validations/quotation.validation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEnterprises } from '@/hooks/content/core/useEnterprises';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useEnterpriseInterlocutors } from '@/hooks/content/core/useEnterpriseInterlocutors';
import { Spinner } from '@/components/shared';
import { useQuotationUpdateFormStructure } from './useQuotationUpdateFormStructure';
import React from 'react';
import { useQuotation } from '@/hooks/content/core/useQuotation';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';

interface QuotationUpdateFormProps {
  id: number;
  className?: string;
}

export const QuotationUpdateForm = ({ id, className }: QuotationUpdateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const quotationStore = useQuotationStore();
  const enterpriseStore = useEnterpriseStore();
  const { quotation, isFetchQuotationPending } = useQuotation({
    id
  });

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress']
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: quotationStore.updateDto?.enterpriseId,
    enabled: !!quotationStore.updateDto?.enterpriseId
  });

  React.useEffect(() => {
    if (quotation && enterprises) {
      quotationStore.set('updateDto', {
        date: quotation?.date ? new Date(quotation.date) : undefined,
        dueDate: quotation?.dueDate ? new Date(quotation.dueDate) : undefined,
        direction: quotation?.direction,
        object: quotation?.object,
        generalConditions: quotation?.generalConditions,
        enterpriseId: quotation?.enterpriseId,
        interlocutorId: quotation?.interlocutorId
      });
      const enterprise = enterprises.find((e) => e.id === quotation.enterpriseId);
      enterpriseStore.set('response', enterprise);
    }
    return () => {
      quotationStore.reset();
      enterpriseStore.reset();
    };
  }, [quotation, enterprises]);

  const { mutate: updateQuotation, isPending: isUpdatePending } = useMutation({
    mutationFn: async () => api.invoicing.quotation.update(id, quotationStore.updateDto),
    onSuccess: (data) => {
      quotationStore.reset();
      enterpriseStore.reset();
      toast.success('Quotation updated successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.message || 'An error occurred while updating the quotation.');
    }
  });

  const handleSubmit = () => {
    const result = createDraftQuotationSchema.safeParse(quotationStore.updateDto);

    if (!result.success) {
      quotationStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    updateQuotation();
  };

  const { mainFormStructure, sidebarFormStructure } = useQuotationUpdateFormStructure({
    store: quotationStore,
    enterprises,
    interlocutorOptions: mapToSelectOptions({
      data: interlocutors,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item) => `${item.firstName} ${item.lastName}`
    }),
    updateQuotation: handleSubmit,
    isUpdatePending
  });

  if (isFetchQuotationPending || isEnterprisesPending) return <Spinner />;

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
          maxSize={isMobile ? '0%' : '30%'}
          className="bg-card">
          <div className="flex h-full items-start justify-center p-6">
            <FormBuilder structure={sidebarFormStructure} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
