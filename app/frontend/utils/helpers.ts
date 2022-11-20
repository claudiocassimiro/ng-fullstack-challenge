import { useEffect, useState } from "react";
import { WindowSizes } from "./types";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSizes>({
    width: 0,
    height: 0,
    isMobile: false,
    isHorizontal: false,
    isDesktop: false,
    isTablet: false,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isHorizontal: window.innerHeight <= 612,
        isTablet: window.innerWidth >= 768 && window?.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      });
    }
    window?.addEventListener(`resize`, handleResize);
    handleResize();
    return () => window?.removeEventListener(`resize`, handleResize);
  }, []);
  return windowSize;
};
