import { Provider } from "react-redux";
import debouncer from "../lib/debouncer";
import { saveState } from "../storage/localStorage";
import store from "../store/store";
import { useRef, useEffect } from "react";

export function StoreProvider({ children }) {
  const subscribedRef = useRef(false);
  const debouncedSaveState = debouncer(saveState, 5000);

  useEffect(() => {
    if (!subscribedRef.current) {
      store.subscribe(() => debouncedSaveState(store.getState()));
    }
    subscribedRef.current = true;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
