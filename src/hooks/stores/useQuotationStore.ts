import { CreateQuotationDto, ResponseQuotationDto, UpdateQuotationDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';
import { ManipulatedFile } from '@/components/shared/form-builder/types';

interface QuotationData {
  response: ResponseQuotationDto | null;
  createDto: CreateQuotationDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateQuotationDto;
  updateDtoErrors: Record<string, string[]>;

  files: ManipulatedFile[];
  sequencePreview: string;
}

interface IQuotationStore extends QuotationData {}

export interface QuotationStore extends IQuotationStore, BaseActions<IQuotationStore> {}

const initialState: QuotationData = {
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
    quotationArticles: [],
    uploads: []
  },
  createDtoErrors: {},
  updateDtoErrors: {},
  files: []
};

export const useQuotationStore = createBaseStore<IQuotationStore>({
  ...initialState
});
