import { CreateTemplateDto, ResponseTemplateDto, UpdateTemplateDto } from '@/types';
import { create } from 'zustand';

interface TemplateData {
  response: ResponseTemplateDto | null;
  createDto: CreateTemplateDto;
  createDtoErrors: Record<string, string[]>;
  updateDto?: UpdateTemplateDto;
  updateDtoErrors: Record<string, string[]>;

  document?: File | null;
}

export interface TemplateStore extends TemplateData {
  set: (name: keyof TemplateData, value: any) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: TemplateData = {
  response: null,
  createDto: {
    name: '',
    description: '',
    documentId: undefined,
    templateType: undefined,
    variables: undefined
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useTemplateStore = create<TemplateStore>((set, get) => ({
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
