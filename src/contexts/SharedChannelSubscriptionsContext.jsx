import { createContext } from "react";
import { useWebSocketSubscription } from "../hooks/useWebSocketSubscription";
import { useSelector } from "react-redux";

export const SharedChannelSubscriptionsContext = createContext();

export function SharedChannelSubscriptionsProvider({ children }) {
  const user_id = useSelector((state) => state.auth.user.id);
  const notifications = useWebSocketSubscription({
    channel: "NotificationsChannel",
    user_id,
  });

  const presenceUpdates = useWebSocketSubscription({
    channel: "PresenceChannel",
  });

  return (
    <SharedChannelSubscriptionsContext.Provider value={{ presenceUpdates, notifications }}>
      {children}
    </SharedChannelSubscriptionsContext.Provider>
  );
}
