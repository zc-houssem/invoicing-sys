import React from 'react';
import { useUI } from '@/context/UIContext';

const resetMainScroll = () => {
  const main = document.querySelector('main');
  if (!main) return;

  main.scrollTop = 0;
};

export const useInvoicingFormScroll = (ready: boolean) => {
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setEnableMainOverflow?.(true);
    resetMainScroll();

    return () => {
      clearEnableMainOverflow?.();
    };
  }, [setEnableMainOverflow, clearEnableMainOverflow]);

  React.useLayoutEffect(() => {
    if (!ready) return;

    resetMainScroll();

    const resetFrame = requestAnimationFrame(resetMainScroll);
    const resetTimer = window.setTimeout(resetMainScroll, 350);
    const resetLateTimer = window.setTimeout(resetMainScroll, 800);

    return () => {
      cancelAnimationFrame(resetFrame);
      window.clearTimeout(resetTimer);
      window.clearTimeout(resetLateTimer);
    };
  }, [ready]);
};
