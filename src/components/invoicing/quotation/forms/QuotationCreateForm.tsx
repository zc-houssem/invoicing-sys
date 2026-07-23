import { useQuotationCreateFormStructure } from './useQuotationCreateFormStructure';
import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useInvoicingFormScroll } from '@/components/invoicing-commons/useInvoicingFormScroll';
import { useQuotationStore } from '@/hooks/stores/useQuotationStore';
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
import { useArticleStore } from '@/hooks/stores/useArticleStore';
import {
  CreateQuotationArticleDto,
  CreateQuotationDto,
  CurrencyPayload,
  ResponseBankAccountDto,
  ResponseRefParamDto
} from '@/types';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useTranslation } from 'react-i18next';
import { useBankAccounts } from '@/hooks/content/core/useBankAccounts';
import { Button } from '@/components/ui/button';
import { Repeat2, Save } from 'lucide-react';
import { Status } from '../../Status';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface QuotationCreateFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationCreateFormProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const quotationStore = useQuotationStore();
  const enterpriseStore = useEnterpriseStore();
  const articleStore = useArticleStore();

  React.useEffect(() => {
    return () => {
      quotationStore.reset();
      enterpriseStore.reset();
    };
  }, []);

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
            const currentFiles = quotationStore.files;
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

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress']
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: quotationStore.createDto.enterpriseId,
    enabled: !!quotationStore.createDto.enterpriseId
  });

  const { currencies, isCurrenciesPending } = useCurrencies();
  const selectedCurrency = React.useMemo(
    () =>
      currencies.find(
        (c) => c.id === quotationStore.createDto.currencyId
      ) as ResponseRefParamDto<CurrencyPayload>,
    [quotationStore.createDto.currencyId, currencies]
  );

  const { bankAccounts, isBankAccountsPending } = useBankAccounts();

  const { mutate: createQuotation, isPending: isCreationPending } = useMutation({
    mutationFn: async (data: CreateQuotationDto) => api.invoicing.quotation.create(data),
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
    } else {
      createQuotation({
        ...quotationStore.createDto,
        quotationArticles: articleStore.articles.map(
          (article, order) =>
            ({
              article: {
                title: article.title,
                description: article.description
              },
              order,
              quantity: article.quantity,
              unitPrice: article.unitPrice,
              discountType: article.discountType,
              discountValue: article.discountValue,
              taxIds: article.taxIds
            }) satisfies CreateQuotationArticleDto
        ),
        uploads: quotationStore.files
          .filter((mf) => mf.serverId)
          .map((mf, order) => ({ uploadId: Number(mf.serverId), order }))
      });
    }
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
    currencyOptions: mapToSelectOptions({
      data: currencies,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseRefParamDto<CurrencyPayload>) =>
        `${tCurrency(item.label)} (${item.extras.symbol})`
    }),
    bankAccountOptions: mapToSelectOptions({
      data: bankAccounts,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseBankAccountDto) => `${item.name} - ${item.rib}`
    }),
    isCreationPending,
    selectedCurrency: selectedCurrency,
    onAttachmentsUpload: handleAttachmentsUpload
  });

  const isFormReady = !isEnterprisesPending && !isCurrenciesPending && !isBankAccountsPending;

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
          <Status className="mx-auto" status="New" />
          <Separator />
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs font-bold">Actions</Label>
            <Button
              type="button"
              size="lg"
              className="rounded-xl"
              variant={'outline'}
              onClick={() => {
                handleSubmit();
              }}>
              <Save className="size-16" />
              <span>{t('commands.save')}</span>
            </Button>
            <Button
              type="button"
              size="lg"
              className="rounded-xl"
              variant={'ghost'}
              onClick={() => {
                handleSubmit();
              }}>
              <Repeat2 className="size-16" />
              <span>{t('commands.reset')}</span>
            </Button>
          </div>
          <Separator />
          <FormBuilder structure={sidebarFormStructure} />
        </>
      }
    />
  );
};
