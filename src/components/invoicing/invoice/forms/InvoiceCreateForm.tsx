import { useInvoiceCreateFormStructure } from './useInvoiceCreateFormStructure';
import { useActiveCompanyStore } from '@/hooks/stores/useActiveCompanyStore';
import { Sequences } from '@/types/sequence';
import { useSequence } from '@/hooks/useSequence';
import { InvoicingFormLayout } from '@/components/invoicing-commons/InvoicingFormLayout';
import { useInvoicingFormScroll } from '@/components/invoicing-commons/useInvoicingFormScroll';
import { useInvoiceStore } from '@/hooks/stores/useInvoiceStore';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { createDraftInvoiceSchema } from '@/types/validations/invoice.validation';
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
  CurrencyPayload,
  ResponseBankAccountDto,
  ResponseInterlocutorDto,
  ResponseRefParamDto,
  ServerErrorResponse,
  TaxWithholdingPayload
} from '@/types';
import { CreateInvoiceArticleDto, CreateInvoiceDto } from '@/types/core/invoicing/invoice';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useTranslation } from 'react-i18next';
import { useBankAccounts } from '@/hooks/content/core/useBankAccounts';
import { Button } from '@/components/ui/button';
import { Repeat2, Save } from 'lucide-react';
import { Status } from '../../Status';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTaxWithholdings } from '@/hooks/content/core/useTaxWithhodlings';

interface InvoiceCreateFormProps {
  className?: string;
}

export const InvoiceCreateForm = ({ className }: InvoiceCreateFormProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const invoiceStore = useInvoiceStore();
  const enterpriseStore = useEnterpriseStore();
  const articleStore = useArticleStore();

  React.useEffect(() => {
    return () => {
      invoiceStore.reset();
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

  const { enterprises, isEnterprisesPending } = useEnterprises({
    join: ['invoicingAddress', 'deliveryAddress'],
    excludeSystem: true
  });
  const { interlocutors, isFetchInterlocutorsPending } = useEnterpriseInterlocutors({
    enterpriseId: invoiceStore.createDto.enterpriseId,
    enabled: !!invoiceStore.createDto.enterpriseId
  });

  const { currencies, isCurrenciesPending } = useCurrencies();
  const { taxWithholdings, isTaxWithholdingsPending } = useTaxWithholdings();

  const selectedCurrency = React.useMemo(
    () =>
      currencies.find(
        (c) => c.id === invoiceStore.createDto.currencyId
      ) as ResponseRefParamDto<CurrencyPayload>,
    [invoiceStore.createDto.currencyId, currencies]
  );

  const selectedTaxWithholding = React.useMemo(
    () =>
      taxWithholdings.find(
        (t) => t.id === invoiceStore.createDto.taxWithholdingId
      ) as ResponseRefParamDto<TaxWithholdingPayload>,
    [invoiceStore.createDto.taxWithholdingId, taxWithholdings]
  );

  const { bankAccounts, isBankAccountsPending } = useBankAccounts();
  const { activeCompanyId } = useActiveCompanyStore();
  useSequence(activeCompanyId, Sequences.INVOICE, (preview: string) => invoiceStore.set('sequencePreview', preview));

  const { mutate: createInvoice, isPending: isCreationPending } = useMutation({
    mutationFn: async (data: CreateInvoiceDto) => api.invoicing.invoice.create(data),
    onSuccess: (data) => {
      invoiceStore.reset();
      router.push('/selling/invoices');
      toast.success('Invoice created successfully!');
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || 'An error occurred while creating the invoice.');
    }
  });

  const handleSubmit = () => {
    const result = createDraftInvoiceSchema.safeParse(invoiceStore.createDto);

    if (!result.success) {
      invoiceStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    } else {
      createInvoice({
        ...invoiceStore.createDto,
        invoiceArticles: articleStore.articles.map(
          (article, order) =>
            ({
              article: {
                title: article.title,
                description: article.description
              },
              order,
              quantity: article.quantity,
              unitPrice: article.unitPrice,
              discountType: article.discountType as 'rate' | 'fixed',
              discountValue: article.discountValue,
              taxIds: article.taxIds
            }) satisfies CreateInvoiceArticleDto
        ),
        uploads: invoiceStore.files
          .filter((mf) => mf.serverId)
          .map((mf, order) => ({ uploadId: Number(mf.serverId), order }))
      });
    }
  };

  const { mainFormStructure, sidebarFormStructure } = useInvoiceCreateFormStructure({
    store: invoiceStore,
    enterprises,
    interlocutorOptions: mapToSelectOptions({
      data: interlocutors,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseInterlocutorDto) => {
        const ei = item.enterpriseInterlocutors?.find(
          (e) => e.enterpriseId === invoiceStore.createDto.enterpriseId
        );
        return `${item.title ? `${item.title} ` : ''}${item.firstName} ${item.lastName}${ei?.position ? ` (${ei.position})` : ''}`;
      }
    }),
    currencyOptions: mapToSelectOptions({
      data: currencies,
      labelKey: '',
      valueKey: 'id',
      labelKeyTransformer: (_label, item: ResponseRefParamDto<CurrencyPayload>) =>
        `${tCurrency(item.label)} (${item.extras.symbol})`
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
    isCreationPending,
    selectedCurrency: selectedCurrency,
    selectedTaxWithholding,
    onAttachmentsUpload: handleAttachmentsUpload
  });

  const isFormReady =
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
