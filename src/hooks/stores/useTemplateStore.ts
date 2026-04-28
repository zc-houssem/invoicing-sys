import { CreateTemplateDto, ResponseTemplateDto, UpdateTemplateDto } from '@/types';
import { BaseActions, createBaseStore } from './useBaseStore';

interface TemplateData {
  response: ResponseTemplateDto | null;
  createDto: CreateTemplateDto;
  createDtoErrors: Record<string, string[]>;
  updateDto?: UpdateTemplateDto;
  updateDtoErrors: Record<string, string[]>;

  document?: File | null;
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
    templateType: undefined,
    variables: undefined,
    backupVariables: undefined
  },
  createDtoErrors: {},
  updateDtoErrors: {},
  progress: 0
};

export const useTemplateStore = createBaseStore<ITemplateStore>({
  ...initialState
});
