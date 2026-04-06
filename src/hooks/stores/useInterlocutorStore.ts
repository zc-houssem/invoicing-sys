import { create } from 'zustand';
import { Interlocutor } from '@/types';

interface InterlocutorData {
  id?: number;
  title?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  position?: string;
}

export interface InterlocutorStore extends InterlocutorData {
  set: (name: keyof InterlocutorData, value: any) => void;
  setInterlocutor: (interlocutor: Interlocutor, firmId?: number) => void;
  reset: () => void;
}

const initialState: InterlocutorData = {
  id: undefined,
  title: '',
  name: '',
  surname: '',
  email: '',
  phone: '',
  position: ''
};

export const useInterlocutorStore = create<InterlocutorStore>((set) => ({
  ...initialState,

  set: (name: keyof InterlocutorData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  setInterlocutor: (interlocutor: Interlocutor, firmId?: number) => {
    const entry = firmId
      ? interlocutor.firmsToInterlocutor?.find((e) => e.firmId === firmId)
      : undefined;
    set({
      id: interlocutor.id,
      title: interlocutor.title,
      name: interlocutor.name,
      surname: interlocutor.surname,
      email: interlocutor.email,
      phone: interlocutor.phone,
      position: entry?.position || ''
    });
  },

  reset: () => {
    set({ ...initialState });
  }
}));
