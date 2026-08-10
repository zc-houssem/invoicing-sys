import { CreateTemplateFooterDto, ResponseTemplateFooterDto, UpdateTemplateFooterDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateFooterData {
  response: ResponseTemplateFooterDto | null;
  createDto: CreateTemplateFooterDto;
  createDtoErrors?: Partial<Record<keyof CreateTemplateFooterDto, string[]>>;
  updateDto?: UpdateTemplateFooterDto;
  updateDtoErrors?: Partial<Record<keyof UpdateTemplateFooterDto, string[]>>;

  previewPicture?: File | string | null;
  progress: number;
}

interface ITemplateFooterStore extends TemplateFooterData {}

export interface TemplateFooterStore extends ITemplateFooterStore, BaseActions<ITemplateFooterStore> {
  setProgress: (progress: number) => void;
  setPreviewPicture: (file: File | string | null) => void;
}

const initialState: TemplateFooterData = {
  response: null,
  createDto: {
    name: '',
    description: '',
    ejsCode: '',
    previewPictureId: undefined
  },
  previewPicture: null,
  progress: 0
};

export const useTemplateFooterStore = createBaseStore<ITemplateFooterStore>({
  ...initialState
});
