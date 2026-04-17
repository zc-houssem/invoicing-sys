import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { cn } from '@/lib/utils';
import { useQuotationCreateFormStructure } from './useQuotationCreateFormStructure';
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
import React from 'react';
import { useRouter } from 'next/router';
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';

interface QuotationCreateFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationCreateFormProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const quotationStore = useQuotationStore();
  const enterpriseStore = useEnterpriseStore();

  React.useEffect(() => {
    return () => {
      quotationStore.reset();
      enterpriseStore.reset();
    };
  }, []);

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress']
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: quotationStore.createDto.enterpriseId,
    enabled: !!quotationStore.createDto.enterpriseId
  });

  const { mutate: createQuotation, isPending: isCreationPending } = useMutation({
    mutationFn: async () => api.invoicing.quotation.create(quotationStore.createDto),
    onSuccess: (data) => {
      quotationStore.reset();
      router.push('/selling/quotations');
      toast.success('Quotation created successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data.message || 'An error occurred while creating the quotation.'
      );
    }
  });

  const handleSubmit = () => {
    const result = createDraftQuotationSchema.safeParse(quotationStore.createDto);

    if (!result.success) {
      quotationStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    createQuotation();
  };

  const { mainFormStructure, sidebarFormStructure } = useQuotationCreateFormStructure({
    store: quotationStore,
    enterprises,
    interlocutorOptions: mapToSelectOptions({
      data: interlocutors,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item) => `${item.firstName} ${item.lastName}`
    }),
    createQuotation: handleSubmit,
    isCreationPending
  });

  if (isEnterprisesPending) return <Spinner />;

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
