import { setDeepValue } from '@/lib/object';
import {
  CreateRefParamDto,
  CreateRefTypeDto,
  ResponseRefParamDto,
  ResponseRefTypeDto,
  UpdateRefParamDto,
  UpdateRefTypeDto
} from '@/types';
import { create } from 'zustand';

interface ReferenceTypesStoreData {
  refType?: ResponseRefTypeDto;
  refParam?: ResponseRefParamDto;
  refTypeCreateDto: CreateRefTypeDto;
  refTypeUpdateDto: UpdateRefTypeDto;
  refParamCreateDto: CreateRefParamDto;
  refParamUpdateDto: UpdateRefParamDto;
  refTypeCreateDtoErrors: Record<string, string[]>;
  refTypeUpdateDtoErrors: Record<string, string[]>;
  refParamCreateDtoErrors: Record<string, string[]>;
  refParamUpdateDtoErrors: Record<string, string[]>;
}

export interface ReferenceTypesStore extends ReferenceTypesStoreData {
  set: <T>(name: keyof ReferenceTypesStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: ReferenceTypesStoreData = {
  refTypeCreateDto: {
    label: '',
    description: '',
    parentId: undefined,
    extras: {}
  },
  refTypeUpdateDto: {},
  refParamCreateDto: {
    label: '',
    description: '',
    refTypeId: undefined,
    extras: {}
  },
  refParamUpdateDto: {},
  refTypeCreateDtoErrors: {},
  refTypeUpdateDtoErrors: {},
  refParamCreateDtoErrors: {},
  refParamUpdateDtoErrors: {}
};

export const useReferenceTypesStore = create<ReferenceTypesStore>((set, get) => ({
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
        { ...(state[rootKey as keyof ReferenceTypesStoreData] as object) },
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
