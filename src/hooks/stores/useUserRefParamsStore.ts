import { setDeepValue } from '@/lib/object';
import { create } from 'zustand';

interface UserRefParamsData {
  objectives: number[];
  industries: number[];
}

const initialState: UserRefParamsData = {
  objectives: [],
  industries: []
};

export interface UserRefParamsStore extends UserRefParamsData {
  set: <T>(name: keyof UserRefParamsData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

export const useUserRefParamsStore = create<UserRefParamsStore>((set) => ({
  ...initialState,
  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },
  setNested: (path, value) => {
    const [rootKey, ...restPath] = path.split('.');
    const nestedPath = restPath.join('.');
    set((state) => {
      const updatedRoot = setDeepValue(
        { ...(state[rootKey as keyof UserRefParamsData] as object) },
        nestedPath,
        value
      );
      return {
        ...state,
        [rootKey]: updatedRoot
      };
    });
  },
  reset: () => {
    set({ ...initialState });
  }
}));
