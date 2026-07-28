import _ from 'lodash';
import { BaseActions, createBaseStore } from './useBaseStore';
import { CreateInterlocutorDto, UpdateInterlocutorDto, ResponseInterlocutorDto } from '@/types';

interface InterlocutorData {
  response?: ResponseInterlocutorDto;
  createDto: CreateInterlocutorDto;
  updateDto?: UpdateInterlocutorDto;
  errors?: Record<string, any>;
}

interface IInterlocutorStore extends InterlocutorData {}

export interface InterlocutorStore extends IInterlocutorStore, BaseActions<IInterlocutorStore> {}

const initialState: InterlocutorData = {
  createDto: {
    title: '' as any,
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }
};

export const useInterlocutorStore = createBaseStore<IInterlocutorStore>({
  ...initialState
});
