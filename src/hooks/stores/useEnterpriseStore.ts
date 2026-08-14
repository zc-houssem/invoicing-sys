import _ from 'lodash';
import { BaseActions, createBaseStore } from './useBaseStore';
import {
  CreateEnterpriseDto,
  ResponseEnterpriseDto,
  UpdateEnterpriseDto
} from '@/types/core/enterprise';

interface EnterpriseData {
  response?: ResponseEnterpriseDto;
  createDto: CreateEnterpriseDto;
  updateDto?: UpdateEnterpriseDto;
  errors?: Record<string, any>;
  logo?: File;
  progress?: number;
}

interface IEnterpriseStore extends EnterpriseData {}

export interface EnterpriseStore extends IEnterpriseStore, BaseActions<IEnterpriseStore> {}

const initialState: EnterpriseData = {
  createDto: {
    name: '',
    phone: '',
    email: '',
    taxId: '',
    notes: '',
    website: '',
    particular: false,
    activityId: undefined,
    currencyId: undefined,
    paymentConditionId: undefined,
    system: false,
    deliveryAddress: {
      address: '',
      address2: '',
      region: '',
      zipcode: undefined,
      countryId: undefined
    },
    invoicingAddress: {
      address: '',
      address2: '',
      region: '',
      zipcode: undefined,
      countryId: undefined
    },
    interlocutors: [
      {
        main: true,
        position: ''
      }
    ],
    logoId: undefined
  },
  logo: undefined,
  progress: 0
};

export const useEnterpriseStore = createBaseStore<IEnterpriseStore>({
  ...initialState
});
