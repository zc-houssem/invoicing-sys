import React from 'react';
import { useUI } from '@/context/UIContext';
import { scrollElementToTop } from '@/hooks/other/useScrollToTopOnRouteChange';

const resetMainScroll = () => {
  scrollElementToTop(document.querySelector('main'));
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
