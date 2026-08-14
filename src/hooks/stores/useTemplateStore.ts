import { CreateTemplateDto, ResponseTemplateDto, UpdateTemplateDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateData {
  response: ResponseTemplateDto | null;
  createDto: CreateTemplateDto;
  createDtoErrors?: Partial<Record<keyof CreateTemplateDto, string[]>>;
  updateDto?: UpdateTemplateDto;
  updateDtoErrors?: Partial<Record<keyof UpdateTemplateDto, string[]>>;

  document?: File | null;
  previewPicture?: File | string | null;
  progress: number;

  variables?: object;
  backupVariables?: object;
}

interface ITemplateStore extends TemplateData {}

export interface TemplateStore extends ITemplateStore, BaseActions<ITemplateStore> {}

const initialState: TemplateData = {
  response: null,
  createDto: {
    name: '',
    description: '',
    documentId: undefined,
    templateTypeId: undefined,
    variables: undefined,
    backupVariables: undefined
  },
  createDtoErrors: {},
  updateDtoErrors: {},
  progress: 0
};

export const useTemplateStore = createBaseStore<TemplateStore>({
  ...initialState
});
