import _ from 'lodash';
import { BaseActions, createBaseStore } from './useBaseStore';
import {
  CreateEnterpriseDto,
  ResponseEnterpriseDto,
  SocialTitles,
  UpdateEnterpriseDto
} from '@/types/core/enterprise';

interface EnterpriseData {
  response?: ResponseEnterpriseDto;
  createDto: CreateEnterpriseDto;
  updateDto?: UpdateEnterpriseDto;
  errors?: Record<string, any>;
}

interface IEnterpriseStore extends EnterpriseData {}

export interface EnterpriseStore extends IEnterpriseStore, BaseActions<IEnterpriseStore> {}

const initialState: EnterpriseData = {
  createDto: {
    name: '',
    phone: '',
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
        interlocutor: {
          title: SocialTitles.MR,
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        },
        main: true,
        position: ''
      }
    ]
  }
};

export const useEnterpriseStore = createBaseStore<IEnterpriseStore>({
  ...initialState
});
