import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ActiveCompanyStore {
  activeCompanyId: number | null;
  setActiveCompanyId: (id: number) => void;
  clearActiveCompanyId: () => void;
}

const isClient = typeof window !== 'undefined';

const fallbackStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

export const useActiveCompanyStore = create<ActiveCompanyStore>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      setActiveCompanyId: (id) => set({ activeCompanyId: id }),
      clearActiveCompanyId: () => set({ activeCompanyId: null })
    }),
    {
      name: 'active-company',
      storage: createJSONStorage(() => (isClient ? localStorage : fallbackStorage))
    }
  )
);
