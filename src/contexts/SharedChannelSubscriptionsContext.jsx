import { createContext, useEffect } from "react";
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

  useEffect(() => {
    const presenceRefreshInterval = setInterval(() => {
      presenceUpdates.performActionOnChannel("refresh_presence");
    }, 10000);

    return () => {
      clearInterval(presenceRefreshInterval);
    };
  }, []);

  return (
    <SharedChannelSubscriptionsContext.Provider
      value={{
        presenceUpdates: presenceUpdates.channelMessage,
        notifications: notifications.channelMessage,
      }}
    >
      {children}
    </SharedChannelSubscriptionsContext.Provider>
  );
}
