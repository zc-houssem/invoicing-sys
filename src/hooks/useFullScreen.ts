import React from 'react';

interface useFullScreenProps {
  initialState?: boolean;
  onToggle?: (isFullscreen: boolean) => void;
}

export const useFullScreen = (
  { initialState = false, onToggle }: useFullScreenProps = {
    initialState: false
  }
) => {
  const [isFullscreen, setIsFullscreen] = React.useState(initialState);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
    onToggle?.(!isFullscreen);
  };

  return {
    isFullscreen,
    toggle: handleFullscreenToggle
  };
};
