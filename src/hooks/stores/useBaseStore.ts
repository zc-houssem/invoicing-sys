import { setDeep } from '@/lib/object';
import { create, StateCreator } from 'zustand';

type SetState<T> = (fn: (state: T) => T) => void;

export type BaseActions<T> = {
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  setNested: (path: string, value: any) => void;
  reset: () => void;
};

export function createBaseStore<T extends object>(
  initialState: any,
  extend?: StateCreator<T & BaseActions<T>, [], [], object>
) {
  return create<T & BaseActions<T>>((set, get) => ({
    ...structuredClone(initialState),

    set: (key, value) => {
      set((state) => ({
        ...state,
        [key]: value
      }));
    },

    setNested: (path, value) => {
      set((state) => setDeep(state, path, value));
    },

    reset: () => {
      set(() => structuredClone(initialState));
    },

    ...(extend ? extend(set as SetState<any>, get, undefined as any) : {})
  }));
}
