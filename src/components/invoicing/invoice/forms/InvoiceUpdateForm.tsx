import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useInvoicingFormScroll } from '@/components/invoicing-commons/useInvoicingFormScroll';
import { useInvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useMutation } from '@tanstack/react-query';
import { api, ServerErrorResponse } from '@/api';
import { toast } from 'sonner';
import { createDraftInvoiceSchema } from '@/types/validations/invoice.validation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEnterprises } from '@/hooks/content/core/useEnterprises';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { useEnterpriseInterlocutors } from '@/hooks/content/core/useEnterpriseInterlocutors';
import { Spinner } from '@/components/shared';
import { useInvoiceUpdateFormStructure } from './useInvoiceUpdateFormStructure';
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
  TaxWithholdingPayload
} from '@/types';
import { UpdateInvoiceArticleDto, UpdateInvoiceDto } from '@/types/core/invoicing/invoice';
import { useBankAccounts } from '@/hooks/content/core/useBankAccounts';
import { useInvoiceWorkflow } from '@/hooks/content/core/useInvoiceWorkflow';
import { Status } from '../../Status';
import { InvoiceActions } from './InvoiceActions';
import { useTranslation } from 'react-i18next';
import { useTaxWithholdings } from '@/hooks/content/core/useTaxWithhodlings';

interface InvoiceUpdateFormProps {
  id: number;
  className?: string;
}

export const InvoiceUpdateForm = ({ id, className }: InvoiceUpdateFormProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation('common');
  const invoiceStore = useInvoiceStore();
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
            const currentFiles = useInvoiceStore.getState().files;
            invoiceStore.set(
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

  const { workflow, isWorkflowPending, refetchWorkflow } = useInvoiceWorkflow({
    id,
    join: [
      'invoiceArticles',
      'invoiceArticles.article',
      'invoiceArticles.taxes',
      'uploads',
      'uploads.upload'
    ]
  });

  const { enterprises, isEnterprisesPending, refetchEnterprises } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress', 'currency'],
    excludeSystem: true
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: invoiceStore.updateDto?.enterpriseId,
    enabled: !!invoiceStore.updateDto?.enterpriseId
  });

  const { currencies, isCurrenciesPending, refetchCurrencies } = useCurrencies();
  const selectedCurrency = React.useMemo(
    () =>
      currencies.find(
        (c) => c.id === workflow?.invoice.currencyId
      ) as ResponseRefParamDto<CurrencyPayload>,
    [workflow?.invoice.currencyId, currencies]
  );
  const { taxWithholdings, isTaxWithholdingsPending } = useTaxWithholdings();

  const selectedTaxWithholding = React.useMemo(
    () =>
      taxWithholdings.find(
        (t) => t.id === invoiceStore.updateDto?.taxWithholdingId
      ) as ResponseRefParamDto<TaxWithholdingPayload>,
    [invoiceStore.updateDto?.taxWithholdingId, taxWithholdings]
  );

  const { bankAccounts, isBankAccountsPending, refetchBankAccounts } = useBankAccounts();

  React.useEffect(() => {
    if (workflow && enterprises) {
      invoiceStore.set('response', workflow.invoice);
      invoiceStore.set('updateDto', {
        date: workflow?.invoice.date ? new Date(workflow.invoice.date) : undefined,
        dueDate: workflow?.invoice.dueDate ? new Date(workflow.invoice.dueDate) : undefined,
        direction: workflow?.invoice.direction,
        object: workflow?.invoice.object,
        generalConditions: workflow?.invoice.generalConditions,
        enterpriseId: workflow?.invoice.enterpriseId,
        interlocutorId: workflow?.invoice.interlocutorId,
        currencyId: workflow?.invoice.currencyId,
        taxWithholdingId: workflow?.invoice.taxWithholdingId,
        bankAccountId: workflow?.invoice.bankAccountId,
        invoiceArticles: [],
        uploads: []
      });
      const enterprise = enterprises.find((e) => e.id === workflow.invoice.enterpriseId);
      enterpriseStore.set('response', enterprise);

      articleStore.set(
        'articles',
        workflow.invoice.invoiceArticles
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

      invoiceStore.set(
        'files',
        (workflow.invoice.uploads ?? [])
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
      invoiceStore.reset();
      enterpriseStore.reset();
      articleStore.reset();
    };
  }, [workflow, enterprises]);

  const { mutate: updateInvoice, isPending: isUpdatePending } = useMutation({
    mutationFn: async (payload: { id: number; data: UpdateInvoiceDto }) =>
      api.invoicing.invoice.update(payload.id, payload.data),
    onSuccess: (data) => {
      handleReload();
      toast.success('Invoice updated successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || 'An error occurred while updating the invoice.');
    }
  });

  const handleSubmit = () => {
    const result = createDraftInvoiceSchema.safeParse(invoiceStore.updateDto);

    if (!result.success) {
      invoiceStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    } else {
      updateInvoice({
        id: invoiceStore.response?.id as number,
        data: {
          ...invoiceStore.updateDto,
          invoiceArticles: articleStore.articles.map(
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
                discountType: article.discountType as 'rate' | 'fixed',
                discountValue: article.discountValue,
                taxIds: article.taxIds
              }) satisfies UpdateInvoiceArticleDto
          ),
          uploads: invoiceStore.files
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

  const { mainFormStructure, sidebarFormStructure } = useInvoiceUpdateFormStructure({
    store: invoiceStore,
    enterprises,
    interlocutorOptions: mapToSelectOptions({
      data: interlocutors,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseInterlocutorDto) => {
        const ei = item.enterpriseInterlocutors?.find(
          (e) => e.enterpriseId === invoiceStore.updateDto?.enterpriseId
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
    taxWithholdingOptions: mapToSelectOptions({
      data: taxWithholdings,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseRefParamDto<TaxWithholdingPayload>) =>
        `${item.label} (${item.extras.rate}%)`
    }),
    bankAccountOptions: mapToSelectOptions({
      data: bankAccounts,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseBankAccountDto) => `${item.name} - ${item.rib}`
    }),
    isUpdatePending,
    selectedCurrency,
    selectedTaxWithholding,
    isUpdatable: !!workflow?.isUpdatable,
    onAttachmentsUpload: handleAttachmentsUpload
  });

  const isFormReady =
    !isWorkflowPending &&
    !isEnterprisesPending &&
    !isCurrenciesPending &&
    !isBankAccountsPending &&
    !isTaxWithholdingsPending;

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
          <Status className="mx-auto" status={workflow?.status || '-'} />
          <InvoiceActions
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
