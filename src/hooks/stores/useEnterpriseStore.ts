import {
  CreateEnterpriseDto,
  ResponseEnterpriseDto,
  SocialTitles,
  UpdateEnterpriseDto
} from '@/types';
import _ from 'lodash';
import { createBaseStore } from './useBaseStore';

interface EnterpriseData {
  response?: ResponseEnterpriseDto;
  createDto: CreateEnterpriseDto;
  updateDto?: UpdateEnterpriseDto;
  errors?: Record<string, any>;
}

export interface EnterpriseStore extends EnterpriseData {
  set: (name: keyof EnterpriseData, value: any) => void;
  setNested: (path: string, value: any) => void;
  reset: () => void;
}

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
export const useEnterpriseStore = createBaseStore<EnterpriseData>({
  ...initialState
});
