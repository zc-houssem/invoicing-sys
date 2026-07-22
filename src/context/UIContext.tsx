import React from 'react';

interface UIContextProps {
  enableMainOverflow: boolean;
  setEnableMainOverflow: (enable: boolean) => void;
  clearEnableMainOverflow: () => void;
}

export const UIContext = React.createContext<Partial<UIContextProps>>({});

export const useUI = () => React.useContext(UIContext);
