import { CreateInvoiceDto, ResponseInvoiceDto, UpdateInvoiceDto } from '@/types/core/invoicing/invoice';
import { BaseActions, createBaseStore } from './useBaseStore';
import { ManipulatedFile } from '@/components/shared/form-builder/types';
import { DEFAULT_INVOICE_INCLUDE_FLAGS } from '@/components/invoicing/invoice/forms/InvoiceIncludeOnTable';

interface InvoiceData {
  response: ResponseInvoiceDto | null;
  createDto: CreateInvoiceDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateInvoiceDto;
  updateDtoErrors: Record<string, string[]>;

  files: ManipulatedFile[];
  sequencePreview: string;
}

interface IInvoiceStore extends InvoiceData {}

export interface InvoiceStore extends IInvoiceStore, BaseActions<IInvoiceStore> {}

const initialState: InvoiceData = {
  sequencePreview: '',
  response: null,
  createDto: {
    direction: 'outgoing',
    date: null,
    dueDate: null,
    object: '',
    generalConditions: undefined,
    enterpriseId: undefined,
    interlocutorId: undefined,
    currencyId: undefined,
    bankAccountId: undefined,
    ...DEFAULT_INVOICE_INCLUDE_FLAGS,
    taxStamp: 0,
    invoiceArticles: [],
    uploads: []
  },
  createDtoErrors: {},
  updateDtoErrors: {},
  files: []
};

export const useInvoiceStore = createBaseStore<IInvoiceStore>({
  ...initialState
});
