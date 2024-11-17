import { useState, useEffect, useCallback } from "react";
import throttler from "../lib/throttler";

export function useScrollable(scrollableRef, autoScrollAnchorRef, config = {}) {
  const threshold = config.threshold || 128;
  const defaultPosition = config.defaultPosition || "bottom";
  const throttlerInterval = config.throttlerInterval || 500;

  const [scrollPosition, setScrollPosition] = useState(defaultPosition);

  // Updates autoScroll state based on the scroll position
  // Debounced to accommodate for the transition while the scroll position shifts to the newest message
  const throttledScrollHandler = useCallback(
    throttler(() => {
      if (scrollableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
        // Scrollable area is too small
        if (threshold * 2 >= scrollHeight) setScrollPosition(defaultPosition);
        // No scrollbar
        else if (clientHeight === scrollHeight)
          setScrollPosition(defaultPosition);
        // Position near bottom
        else if (scrollTop + clientHeight + threshold >= scrollHeight)
          setScrollPosition("bottom");
        // Position near top
        else if (scrollTop <= threshold) setScrollPosition("top");
        else setScrollPosition("middle");
      }
    }, throttlerInterval),
    []
  );

  const triggerAutoScroll = () => {
    if (scrollPosition === "bottom") scrollToAnchor({ behavior: "smooth" });
  };

  const readjustPositionAfterPrepending = useCallback(async (callbackFn) => {
    const { scrollHeight, scrollTop } = scrollableRef.current;
    await callbackFn();
    setTimeout(() => {
      if (scrollableRef.current) {
        const heightDiff = scrollableRef.current.scrollHeight - scrollHeight;
        scrollableRef.current.scrollTop = scrollTop + heightDiff;
      }
    }, 0);
  }, []);

  const scrollToAnchor = (params = {}) => {
    setTimeout(() => {
      if (autoScrollAnchorRef.current)
        autoScrollAnchorRef.current.scrollIntoView(params);
    }, 0);
  };

  // Initially set the scroll position to the bottom of the scrollable element
  useEffect(() => {
    if (autoScrollAnchorRef.current)
      autoScrollAnchorRef.current.scrollIntoView();

    if (scrollableRef.current)
      scrollableRef.current.onscroll = throttledScrollHandler;
  }, []);

  return {
    triggerAutoScroll,
    scrollPosition,
    scrollToAnchor,
    readjustPositionAfterPrepending,
  };
}
