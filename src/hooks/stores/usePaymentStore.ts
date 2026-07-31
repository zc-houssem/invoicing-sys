import {
  CreatePaymentDto,
  ResponsePaymentDto,
  UpdatePaymentDto,
  PAYMENT_MODE,
} from '@/types/core/invoicing/payment';
import { BaseActions, createBaseStore } from './useBaseStore';
import { ManipulatedFile } from '@/components/shared/form-builder/types';

interface PaymentData {
  response: ResponsePaymentDto | null;
  createDto: CreatePaymentDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdatePaymentDto;
  updateDtoErrors: Record<string, string[]>;

  files: ManipulatedFile[];
}

interface IPaymentStore extends PaymentData {}

export interface PaymentStore extends IPaymentStore, BaseActions<IPaymentStore> {}

const initialState: PaymentData = {
  response: null,
  createDto: {
    amount: 0,
    fee: 0,
    convertionRate: 1,
    date: null,
    mode: PAYMENT_MODE.Cash,
    notes: '',
    enterpriseId: 0,
    interlocutorId: undefined,
    currencyId: undefined,
    invoices: [],
    uploads: [],
  },
  createDtoErrors: {},
  updateDtoErrors: {},
  files: [],
};

export const usePaymentStore = createBaseStore<IPaymentStore>({
  ...initialState,
});
