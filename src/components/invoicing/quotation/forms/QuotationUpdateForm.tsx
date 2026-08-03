import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useInvoicingFormScroll } from '@/components/invoicing-commons/useInvoicingFormScroll';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
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
  ResponseInterlocutorDto,
  ResponseRefParamDto,
  ServerErrorResponse,
  UpdateQuotationArticleDto,
  UpdateQuotationDto
} from '@/types';
import { useBankAccounts } from '@/hooks/content/core/useBankAccounts';
import { useQuotationWorkflow } from '@/hooks/content/core/useQuotationWorkflow';
import { DocumentMetaHeader } from '../../CreatedByDisplay';
import { QuotationActions } from './QuotationActions';
import { useTranslation } from 'react-i18next';

interface QuotationUpdateFormProps {
  id: number;
  className?: string;
}

export const QuotationUpdateForm = ({ id, className }: QuotationUpdateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const quotationStore = useQuotationStore();
  const enterpriseStore = useEnterpriseStore();
  const articleStore = useArticleStore();

  const handleAttachmentsUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      }
    ) => {
      await Promise.all(
        files.map(async (file) => {
          try {
            const results = await api.upload.uploadFiles([file], (percent) => {
              onProgress(file, percent);
            });
            const uploaded = results[0];
            const currentFiles = useQuotationStore.getState().files;
            quotationStore.set(
              'files',
              currentFiles.map((mf) =>
                mf.file === file
                  ? { ...mf, serverId: String(uploaded.id ?? ''), progress: 100 }
                  : mf
              )
            );
            onSuccess(file);
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            onError(file, error);
          }
        })
      );
    },
    []
  );

  const { workflow, isWorkflowPending, refetchWorkflow } = useQuotationWorkflow({
    id,
    join: [
      'quotationArticles',
      'quotationArticles.article',
      'quotationArticles.taxes',
      'uploads',
      'uploads.upload',
      'createdBy',
      'invoices'
    ]
  });

  const { enterprises, isEnterprisesPending, refetchEnterprises } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress', 'currency'],
    excludeSystem: true
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
      console.log(workflow.quotation);
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
        notes: workflow?.quotation.notes,
        quotationArticles: [],
        uploads: []
      });
      const enterprise = enterprises.find((e) => e.id === workflow.quotation.enterpriseId);
      enterpriseStore.set('response', enterprise);

      articleStore.set(
        'articles',
        workflow.quotation.quotationArticles
          .sort((a, b) => a.order - b.order)
          .map((qa, order) => {
            return {
              clientId: qa.article.id.toString(),
              id: qa.id,
              articleId: qa.articleId,
              order,
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

      quotationStore.set(
        'files',
        (workflow.quotation.uploads ?? [])
          .sort((a, b) => a.order - b.order)
          .map((qu) => ({
            id: String(qu.id),
            name: qu.upload.filename,
            progress: 100,
            serverId: String(qu.uploadId)
          }))
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
      handleReload();
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
            (article, order) =>
              ({
                id: article.id as number,
                article: {
                  id: article.articleId as number,
                  title: article.title,
                  description: article.description
                },
                order,
                articleId: article.articleId,
                quantity: article.quantity,
                unitPrice: article.unitPrice,
                discountType: article.discountType,
                discountValue: article.discountValue,
                taxIds: article.taxIds
              }) satisfies UpdateQuotationArticleDto
          ),
          uploads: quotationStore.files
            .filter((mf) => mf.serverId)
            .map((mf, order) => ({ id: Number(mf.id) || 0, uploadId: Number(mf.serverId), order }))
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
      labelKeyTransformer: (_label, item: ResponseInterlocutorDto) => {
        const ei = item.enterpriseInterlocutors?.find(
          (e) => e.enterpriseId === quotationStore.updateDto?.enterpriseId
        );
        return `${item.title ? `${item.title} ` : ''}${item.firstName} ${item.lastName}${ei?.position ? ` (${ei.position})` : ''}`;
      }
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
    isUpdatable: !!workflow?.isUpdatable,
    onAttachmentsUpload: handleAttachmentsUpload
  });

  const isFormReady =
    !isWorkflowPending && !isEnterprisesPending && !isCurrenciesPending && !isBankAccountsPending;

  useInvoicingFormScroll(isFormReady);

  if (!isFormReady) {
    return <Spinner className="items-start justify-start pt-8" />;
  }

  return (
    <InvoicingFormLayout
      className={className}
      isMobile={isMobile}
      sidebarTitle={t('commands.actions')}
      main={<FormBuilder structure={mainFormStructure} />}
      sidebar={
        <>
          <DocumentMetaHeader
            status={workflow?.status || '-'}
            createdByLabel={tInvoicing('quotation.form.createdBy')}
            user={quotationStore.response?.createdBy}
            extraRows={
              quotationStore.response?.invoices && quotationStore.response.invoices.length > 0
                ? [
                    {
                      label: tInvoicing('quotation.form.invoices', 'Invoices'),
                      value: (
                        <div className="flex flex-col gap-1">
                          {quotationStore.response.invoices.map((invoice) => (
                            <a
                              key={invoice.id}
                              href={`/selling/invoices/${invoice.id}`}
                              className="font-medium text-primary hover:underline">
                              #{invoice.sequence || invoice.id}
                            </a>
                          ))}
                        </div>
                      )
                    }
                  ]
                : []
            }
          />
          <QuotationActions
            className="my-4"
            workflow={workflow}
            save={handleSubmit}
            reload={handleReload}
            reset={handleReload}
          />
          <FormBuilder structure={sidebarFormStructure} />
        </>
      }
    />
  );
};
