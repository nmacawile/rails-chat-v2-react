import { createContext } from "react";
import { useWebSocketSubscription } from "../hooks/useWebSocketSubscription";

export const SharedChannelSubscriptionsContext = createContext();

export function SharedChannelSubscriptionsProvider({ children }) {
  const presenceUpdates = useWebSocketSubscription({
    channel: "PresenceChannel",
  });

  return (
    <SharedChannelSubscriptionsContext.Provider value={{ presenceUpdates }}>
      {children}
    </SharedChannelSubscriptionsContext.Provider>
  );
}
