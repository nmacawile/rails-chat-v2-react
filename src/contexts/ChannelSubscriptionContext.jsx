import { createContext } from "react";
import { useWebSocketSubscription } from "../hooks/useWebSocketSubscription";

export const ChannelSubscriptionContext = createContext();

export function ChannelSubscriptionProvider({ channelIdentifier, children }) {
  const channelMessage = useWebSocketSubscription(channelIdentifier);

  return (
    <ChannelSubscriptionContext.Provider value={channelMessage}>
      {children}
    </ChannelSubscriptionContext.Provider>
  );
}
