import { CreateEnterpriseMemberDto, ResponseEnterpriseMemberDto } from '@/types';
import { create } from 'zustand';

interface EnterpriseMemberData {
  response: ResponseEnterpriseMemberDto | null;
  createDto: CreateEnterpriseMemberDto;
  createDtoErrors: Record<string, string[]>;
}

export interface EnterpriseMemberStore extends EnterpriseMemberData {
  set: (name: keyof EnterpriseMemberData, value: unknown) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: EnterpriseMemberData = {
  response: null,
  createDto: {
    userId: '',
    isOwner: false
  },
  createDtoErrors: {}
};

export const useEnterpriseMemberStore = create<EnterpriseMemberStore>((set) => ({
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

      let current: Record<string, unknown> = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        } else {
          current[key] = { ...(current[key] as Record<string, unknown>) };
        }
        current = current[key] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;

      return newState;
    });
  },

  reset: () => set({ ...initialState })
}));
