import { CreateQuotationDto, ResponseQuotationDto, UpdateQuotationDto } from '@/types';
import { create } from 'zustand';

interface QuotationData {
  response: ResponseQuotationDto | null;
  createDto: CreateQuotationDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateQuotationDto;
  updateDtoErrors: Record<string, string[]>;
}

export interface QuotationStore extends QuotationData {
  set: (name: keyof QuotationData, value: any) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: QuotationData = {
  response: null,
  createDto: {
    direction: 'outgoing',
    date: null,
    dueDate: null,
    object: '',
    generalConditions: ''
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useQuotationStore = create<QuotationStore>((set, get) => ({
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
