import { create } from 'zustand';
import { UpdateSequentialDto } from '@/types/sequence';

type SequenceStore = {
  // data
  sequences: Record<string, UpdateSequentialDto>;
  // methods
  setSequence: (type: string, seq: UpdateSequentialDto) => void;
  set: (type: string, key: keyof UpdateSequentialDto, value: any) => void;
  reset: () => void;
};

const initialState = {
  sequences: {}
};

export const useSequenceStore = create<SequenceStore>((set) => ({
  ...initialState,

  setSequence: (type: string, seq: UpdateSequentialDto) =>
    set((state) => ({
      ...state,
      sequences: {
        ...state.sequences,
        [type]: seq
      }
    })),

  set: (type: string, key: keyof UpdateSequentialDto, value: any) =>
    set((state) => ({
      ...state,
      sequences: {
        ...state.sequences,
        [type]: {
          ...(state.sequences[type] || {}),
          [key]: value
        }
      }
    })),

  reset: () => set({ ...initialState })
}));
