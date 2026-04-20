import { CreateTaxRateDto, ResponseTaxRateDto, UpdateTaxRateDto } from '@/types';
import { create } from 'zustand';

interface TaxRateData {
  response: ResponseTaxRateDto | null;
  createDto: CreateTaxRateDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateTaxRateDto;
  updateDtoErrors: Record<string, string[]>;
}

export interface TaxRateStore extends TaxRateData {
  set: (name: keyof TaxRateData, value: any) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: TaxRateData = {
  response: null,
  createDto: {
    label: '',
    value: 0,
    type: 'rate',
    special: false,
    currencyId: undefined
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useTaxRateStore = create<TaxRateStore>((set, get) => ({
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
