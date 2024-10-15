import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";
import {
  serverMessageFilter,
  messageFormatter,
} from "../helpers/webSocketHelpers";
import shallowEqual from "../lib/shallowEqual";
import { ReadyState } from "react-use-websocket";

const SubscriptionState = { UNSUBSCRIBED: 0, SUBSCRIBING: 1, SUBSCRIBED: 2 };

export function useWebSocketSubscription(channelIdentifier) {
  const [channelMessage, setChannelMessage] = useState(null);
  const { sendMessage, lastMessage, readyState } = useContext(WebSocketContext);
  const subscriptionRef = useRef(SubscriptionState.UNSUBSCRIBED);

  // Sends a 'subscribe' command to the WebSocket server
  const subscribeToChannel = useCallback(() => {
    if (subscriptionRef.current === SubscriptionState.UNSUBSCRIBED) {
      subscriptionRef.current = SubscriptionState.SUBSCRIBING;
      sendMessage(messageFormatter("subscribe", channelIdentifier));
    }
  }, [sendMessage, channelIdentifier]);

  // Sends an 'unsubscribe' command to the WebSocket server
  const unsubscribeFromChannel = useCallback(() => {
    if (subscriptionRef.current === SubscriptionState.SUBSCRIBED) {
      subscriptionRef.current = SubscriptionState.UNSUBSCRIBED;
      sendMessage(messageFormatter("unsubscribe", channelIdentifier));
    }
  }, [sendMessage, channelIdentifier]);

  // Filters and displays incoming WebSocket messages
  // 'sendMessage' is listed as a dependency
  // to mirror the update of the WebSocket instance
  // in case of a reconnection.
  const channelMessageScanner = useCallback(
    (serverMessage) => {
      const filteredMessage = serverMessageFilter(
        ({ identifier, message }) =>
          message && shallowEqual(identifier, channelIdentifier),
        serverMessage
      );
      if (filteredMessage) setChannelMessage(filteredMessage);
    },
    [sendMessage, channelIdentifier, setChannelMessage]
  );

  // Prevent duplication of subscriptions caused by React's Strict Mode
  const subscriptionConfirmationListener = useCallback(
    (serverMessage) => {
      const filteredMessage = serverMessageFilter(
        ({ identifier, type }) =>
          shallowEqual(identifier, channelIdentifier) &&
          type === "confirm_subscription",
        serverMessage
      );
      if (filteredMessage) {
        subscriptionRef.current = SubscriptionState.SUBSCRIBED;
      }
    },
    [sendMessage, channelIdentifier]
  );

  // Handles incoming WebSocket messages
  useEffect(() => {
    channelMessageScanner(lastMessage);
    subscriptionConfirmationListener(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribeToChannel();
      return () => {
        unsubscribeFromChannel();
      };
    }
  }, [readyState]);

  return channelMessage;
}
