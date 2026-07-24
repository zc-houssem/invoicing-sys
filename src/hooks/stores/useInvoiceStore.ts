import { CreateInvoiceDto, ResponseInvoiceDto, UpdateInvoiceDto } from '@/types/core/invoicing/invoice';
import { BaseActions, createBaseStore } from './useBaseStore';
import { ManipulatedFile } from '@/components/shared/form-builder/types';

interface InvoiceData {
  response: ResponseInvoiceDto | null;
  createDto: CreateInvoiceDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateInvoiceDto;
  updateDtoErrors: Record<string, string[]>;

  files: ManipulatedFile[];
}

interface IInvoiceStore extends InvoiceData {}

export interface InvoiceStore extends IInvoiceStore, BaseActions<IInvoiceStore> {}

const initialState: InvoiceData = {
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
