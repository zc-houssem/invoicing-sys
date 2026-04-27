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
import { useEnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import { LineArticle } from '@/types/core/article';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import {
  CurrencyPayload,
  ResponseBankAccountDto,
  ResponseRefParamDto,
  UpdateQuotationArticleDto,
  UpdateQuotationDto
} from '@/types';
import { useBankAccounts } from '@/hooks/content/core/useBankAccounts';
import { useQuotationWorkflow } from '@/hooks/content/core/useQuotationWorkflow';
import { Status } from '../../Status';
import { QuotationActions } from './QuotationActions';

interface QuotationUpdateFormProps {
  id: number;
  className?: string;
}

export const QuotationUpdateForm = ({ id, className }: QuotationUpdateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const quotationStore = useQuotationStore();
  const enterpriseStore = useEnterpriseStore();
  const articleStore = useArticleStore();

  const { workflow, isWorkflowPending, refetchWorkflow } = useQuotationWorkflow({
    id,
    join: ['quotationArticles', 'quotationArticles.article', 'quotationArticles.taxes']
  });

  const { enterprises, isEnterprisesPending, refetchEnterprises } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress', 'currency']
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: quotationStore.updateDto?.enterpriseId,
    enabled: !!quotationStore.updateDto?.enterpriseId
  });

  const { currencies, isCurrenciesPending, refetchCurrencies } = useCurrencies();
  const selectedCurrency = React.useMemo(
    () =>
      currencies.find(
        (c) => c.id === quotationStore.updateDto?.currencyId
      ) as ResponseRefParamDto<CurrencyPayload>,
    [quotationStore.updateDto?.currencyId, currencies]
  );

  const { bankAccounts, isBankAccountsPending, refetchBankAccounts } = useBankAccounts();

  React.useEffect(() => {
    if (workflow && enterprises) {
      quotationStore.set('response', workflow.quotation);
      quotationStore.set('updateDto', {
        date: workflow?.quotation.date ? new Date(workflow.quotation.date) : undefined,
        dueDate: workflow?.quotation.dueDate ? new Date(workflow.quotation.dueDate) : undefined,
        direction: workflow?.quotation.direction,
        object: workflow?.quotation.object,
        generalConditions: workflow?.quotation.generalConditions,
        enterpriseId: workflow?.quotation.enterpriseId,
        interlocutorId: workflow?.quotation.interlocutorId,
        currencyId: workflow?.quotation.currencyId,
        bankAccountId: workflow?.quotation.bankAccountId,
        quotationArticles: []
      });
      const enterprise = enterprises.find((e) => e.id === workflow.quotation.enterpriseId);
      enterpriseStore.set('response', enterprise);

      articleStore.set(
        'articles',
        workflow.quotation.quotationArticles.map((qa) => {
          return {
            clientId: qa.article.id.toString(),
            id: qa.id,
            articleId: qa.article.id,
            title: qa.article.title,
            description: qa.article.description,
            unitPrice: qa.unitPrice,
            quantity: qa.quantity,
            discountType: qa.discountType,
            discountValue: qa.discountValue,
            taxIds: qa.taxes?.map((t) => t.id) || []
          } satisfies LineArticle;
        })
      );
    }
    return () => {
      quotationStore.reset();
      enterpriseStore.reset();
      articleStore.reset();
    };
  }, [workflow, enterprises]);

  const { mutate: updateQuotation, isPending: isUpdatePending } = useMutation({
    mutationFn: async (payload: { id: number; data: UpdateQuotationDto }) =>
      api.invoicing.quotation.update(payload.id, payload.data),
    onSuccess: (data) => {
      toast.success('Quotation updated successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data.message || 'An error occurred while updating the quotation.'
      );
    }
  });

  const handleSubmit = () => {
    const result = createDraftQuotationSchema.safeParse(quotationStore.updateDto);

    if (!result.success) {
      quotationStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    } else {
      updateQuotation({
        id: quotationStore.response?.id as number,
        data: {
          ...quotationStore.updateDto,
          quotationArticles: articleStore.articles.map(
            (article) =>
              ({
                id: article.id!,
                article: {
                  title: article.title,
                  description: article.description
                },
                articleId: article.articleId!,
                quantity: article.quantity,
                unitPrice: article.unitPrice,
                discountType: article.discountType,
                discountValue: article.discountValue,
                taxIds: article.taxIds
              }) satisfies UpdateQuotationArticleDto
          )
        }
      });
    }
  };

  const handleReload = () => {
    refetchWorkflow();
    refetchEnterprises();
    refetchCurrencies();
    refetchBankAccounts();
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
    currencyOptions: mapToSelectOptions({
      data: currencies,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseRefParamDto<CurrencyPayload>) =>
        `${item.label} (${item.extras.symbol})`
    }),
    bankAccountOptions: mapToSelectOptions({
      data: bankAccounts,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseBankAccountDto) => `${item.name} - ${item.rib}`
    }),
    isUpdatePending,
    selectedCurrency,
    isUpdatable: !!workflow?.isUpdatable
  });

  if (isWorkflowPending || isEnterprisesPending || isCurrenciesPending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden py-4', className)}>
      <ResizablePanelGroup
        orientation={isMobile ? 'vertical' : 'horizontal'}
        className=" rounded-lg border">
        <ResizablePanel defaultSize={isMobile ? '100%' : '75%'}>
          <div className="flex items-center justify-center p-6 container mx-auto">
            <FormBuilder structure={mainFormStructure} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={isMobile ? '0%' : '25%'}
          minSize={isMobile ? '0%' : '20%'}
          maxSize={isMobile ? '0%' : '30%'}
          className="bg-card">
          <div className="flex flex-col h-full items-start p-6 container mx-auto">
            <Status className="mx-auto" status={workflow?.status || '-'} />
            <QuotationActions
              className="my-4"
              workflow={workflow}
              save={handleSubmit}
              reload={handleReload}
              reset={handleReload}
            />
            <FormBuilder structure={sidebarFormStructure} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
