import {
  CreateTemplateFooterDto,
  ResponseTemplateFooterDto,
  UpdateTemplateFooterDto
} from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateFooterData {
  response: ResponseTemplateFooterDto | null;
  createDto: CreateTemplateFooterDto;
  createDtoErrors?: Partial<Record<keyof CreateTemplateFooterDto, string[]>>;
  updateDto?: UpdateTemplateFooterDto;
  updateDtoErrors?: Partial<Record<keyof UpdateTemplateFooterDto, string[]>>;
}

interface ITemplateFooterStore extends TemplateFooterData {}

export interface TemplateFooterStore
  extends ITemplateFooterStore,
    BaseActions<ITemplateFooterStore> {}

const initialState: TemplateFooterData = {
  response: null,
  createDto: {
    name: '',
    description: '',
    ejsCode: '',
    previewPictureId: undefined
  }
};

export const useTemplateFooterStore = createBaseStore<TemplateFooterStore>({
  ...initialState
});
