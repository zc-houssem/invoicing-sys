import { api } from '@/api';
import { CreateEnterpriseDto, ResponseEnterpriseDto, UpdateEnterpriseDto } from '@/types';
import _ from 'lodash';
import create from 'zustand';

interface EnterpriseData {
  response?: ResponseEnterpriseDto;
  createDto: CreateEnterpriseDto;
  updateDto?: UpdateEnterpriseDto;
  errors?: Record<string, any>;
}

export interface EnterpriseStore extends EnterpriseData {
  set: (name: keyof EnterpriseData, value: any) => void;
  setNested: (path: string, value: any) => void;
  reset: () => void;
}

const initialState: EnterpriseData = {
  createDto: {
    name: '',
    phone: '',
    taxId: '',
    notes: '',
    website: '',
    particular: false
  }
};

export const useEnterpriseStore = create<EnterpriseStore>((set, get) => ({
  ...initialState,
  set: (name: keyof EnterpriseData, value: any) => {
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

  reset: () => {
    set(() => ({
      ...initialState
    }));
  }
}));
