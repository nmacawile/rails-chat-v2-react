import { useState, useEffect, useCallback } from "react";
import debouncer from "../lib/debouncer";

export function useScrollable(scrollableRef, scrollableBottomRef) {
  const [autoScroll, setAutoScroll] = useState(true);

  // Updates autoScroll state based on the scroll position
  // Debounced to accomodate for the transition while the scroll position shifts to the newest message
  const debouncedScrollHandler = useCallback(
    debouncer(() => {
      if (scrollableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
        setAutoScroll(scrollTop + clientHeight === scrollHeight);
      }
    }, 500),
    []
  );

  // Initially set the scroll position to the bottom of the scrollable element
  useEffect(() => {
    if (scrollableRef.current)
      scrollableRef.current.onscroll = debouncedScrollHandler;

    if (scrollableBottomRef.current)
      scrollableBottomRef.current.scrollIntoView();
  }, []);

  return autoScroll;
}
