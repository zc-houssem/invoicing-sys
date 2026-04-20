import { CreateQuotationDto, ResponseQuotationDto, UpdateQuotationDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface QuotationData {
  response: ResponseQuotationDto | null;
  createDto: CreateQuotationDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateQuotationDto;
  updateDtoErrors: Record<string, string[]>;
}

interface IQuotationStore extends QuotationData {}

export interface QuotationStore extends IQuotationStore, BaseActions<IQuotationStore> {}

const initialState: QuotationData = {
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
    quotationArticles: []
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useQuotationStore = createBaseStore<IQuotationStore>({
  ...initialState
});
