import { useState, useEffect, useCallback } from "react";
import debouncer from "../lib/debouncer";

export function useScrollable(scrollableRef, scrollableBottomRef) {
  const threshold = 128;
  const [scrollPosition, setScrollPosition] = useState();

  // Updates autoScroll state based on the scroll position
  // Debounced to accommodate for the transition while the scroll position shifts to the newest message
  const debouncedScrollHandler = useCallback(
    debouncer(() => {
      if (scrollableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
        // Position near bottom
        if (scrollTop + clientHeight + threshold >= scrollHeight)
          setScrollPosition("bottom");
        // Position near top
        else if (scrollTop <= threshold) setScrollPosition("top");
        else setScrollPosition("middle");
      }
    }, 500),
    []
  );

  const triggerAutoScroll = () => {
    if (scrollPosition === "bottom") scrollToBottom({ behavior: "smooth" });
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

  const scrollToBottom = (params = {}) => {
    setTimeout(() => {
      if (scrollableBottomRef.current)
        scrollableBottomRef.current.scrollIntoView(params);
    }, 0);
  };

  // Initially set the scroll position to the bottom of the scrollable element
  useEffect(() => {
    if (scrollableRef.current)
      scrollableRef.current.onscroll = debouncedScrollHandler;

    if (scrollableBottomRef.current)
      scrollableBottomRef.current.scrollIntoView();
  }, []);

  return {
    triggerAutoScroll,
    scrollPosition,
    scrollToBottom,
    readjustPositionAfterPrepending,
  };
}
