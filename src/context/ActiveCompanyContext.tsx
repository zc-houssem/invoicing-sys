import React, { createContext, useContext, useEffect, useState } from 'react';

interface ActiveCompanyContextType {
  activeCompanyId: number | null;
  setActiveCompanyId: (id: number) => void;
  clearActiveCompanyId: () => void;
}

const ActiveCompanyContext = createContext<ActiveCompanyContextType | undefined>(undefined);

const STORAGE_KEY = 'active-company';

export const ActiveCompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCompanyId, setActiveCompanyIdState] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed.state?.activeCompanyId === 'number') {
            setActiveCompanyIdState(parsed.state.activeCompanyId);
          } else if (typeof parsed === 'number') {
            setActiveCompanyIdState(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load active company from localStorage', e);
      }
    }
  }, []);

  const setActiveCompanyId = (id: number) => {
    setActiveCompanyIdState(id);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { activeCompanyId: id } }));
      } catch (e) {
        console.error('Failed to save active company to localStorage', e);
      }
    }
  };

  const clearActiveCompanyId = () => {
    setActiveCompanyIdState(null);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear active company from localStorage', e);
      }
    }
  };

  return (
    <ActiveCompanyContext.Provider
      value={{
        activeCompanyId,
        setActiveCompanyId,
        clearActiveCompanyId
      }}
    >
      {children}
    </ActiveCompanyContext.Provider>
  );
};

export const useActiveCompanyContext = (): ActiveCompanyContextType => {
  const context = useContext(ActiveCompanyContext);
  if (!context) {
    throw new Error('useActiveCompanyContext must be used within an ActiveCompanyProvider');
  }
  return context;
};

// Export alias for backward compatibility
export const useActiveCompanyStore = useActiveCompanyContext;
