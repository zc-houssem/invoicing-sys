import { CreateBankAccountDto, ResponseBankAccountDto, UpdateBankAccountDto } from '@/types';
import { create } from 'zustand';

interface BankAccountData {
  response: ResponseBankAccountDto | null;
  createDto: CreateBankAccountDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateBankAccountDto;
  updateDtoErrors: Record<string, string[]>;
}

export interface BankAccountStore extends BankAccountData {
  set: (name: keyof BankAccountData, value: any) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: BankAccountData = {
  response: null,
  createDto: {
    name: '',
    bic: '',
    currencyId: undefined,
    rib: '',
    iban: '',
    isMain: false
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useBankAccountStore = create<BankAccountStore>((set, get) => ({
  ...initialState,

  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  setNested: (path, value) => {
    set((state) => {
      const keys = path.split('.');
      const newState = { ...state };

      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return newState;
    });
  },

  reset: () => set({ ...initialState })
}));
