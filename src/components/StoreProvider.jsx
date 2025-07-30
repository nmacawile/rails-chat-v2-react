import { Provider } from "react-redux";
import throttler from "../lib/throttler";
import { saveState } from "../storage/localStorage";
import store from "../store/store";
import { useRef, useEffect } from "react";

export function StoreProvider({ children }) {
  const subscribedRef = useRef(false);
  const throttledSaveState = throttler(saveState, 500);

  useEffect(() => {
    if (!subscribedRef.current) {
      store.subscribe(() => throttledSaveState(store.getState()));
    }
    subscribedRef.current = true;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
