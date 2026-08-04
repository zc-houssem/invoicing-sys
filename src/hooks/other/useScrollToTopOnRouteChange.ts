import React from 'react';
import { useRouter } from 'next/router';

export const scrollElementToTop = (element: HTMLElement | null) => {
  element?.scrollTo({ top: 0, left: 0 });
};

export const useScrollToTopOnRouteChange = () => {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLElement | null>(null);

  const scrollToTop = React.useCallback(() => {
    scrollElementToTop(scrollRef.current);
  }, []);

  React.useEffect(() => {
    scrollToTop();

    const handleRouteChange = () => {
      requestAnimationFrame(scrollToTop);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, scrollToTop]);

  return { scrollRef, scrollToTop };
};
