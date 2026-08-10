import { CreateTemplateHeaderDto, ResponseTemplateHeaderDto, UpdateTemplateHeaderDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateHeaderData {
  response: ResponseTemplateHeaderDto | null;
  createDto: CreateTemplateHeaderDto;
  createDtoErrors?: Partial<Record<keyof CreateTemplateHeaderDto, string[]>>;
  updateDto?: UpdateTemplateHeaderDto;
  updateDtoErrors?: Partial<Record<keyof UpdateTemplateHeaderDto, string[]>>;

  previewPicture?: File | string | null;
  progress: number;
}

interface ITemplateHeaderStore extends TemplateHeaderData {}

export interface TemplateHeaderStore extends ITemplateHeaderStore, BaseActions<ITemplateHeaderStore> {
  setProgress: (progress: number) => void;
  setPreviewPicture: (file: File | string | null) => void;
}

const initialState: TemplateHeaderData = {
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

export const useTemplateHeaderStore = createBaseStore<ITemplateHeaderStore>({
  ...initialState
});
