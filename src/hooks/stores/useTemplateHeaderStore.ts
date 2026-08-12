import {
  CreateTemplateHeaderDto,
  ResponseTemplateHeaderDto,
  UpdateTemplateHeaderDto
} from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateHeaderData {
  response: ResponseTemplateHeaderDto | null;
  createDto: CreateTemplateHeaderDto;
  createDtoErrors?: Partial<Record<keyof CreateTemplateHeaderDto, string[]>>;
  updateDto?: UpdateTemplateHeaderDto;
  updateDtoErrors?: Partial<Record<keyof UpdateTemplateHeaderDto, string[]>>;
}

interface ITemplateHeaderStore extends TemplateHeaderData {}

export interface TemplateHeaderStore
  extends ITemplateHeaderStore,
    BaseActions<ITemplateHeaderStore> {}

const initialState: TemplateHeaderData = {
  response: null,
  createDto: {
    name: '',
    description: '',
    ejsCode: '',
    previewPictureId: undefined
  }
};

export const useTemplateHeaderStore = createBaseStore<TemplateHeaderStore>({
  ...initialState
});
