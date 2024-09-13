import { createContext } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const { auth_token } = useSelector((state) => state.auth);
  const socketUrl = import.meta.env.VITE_CABLE_URL;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    queryParams: { Authorization: `Bearer ${auth_token}` },
    shouldReconnect: (event) => true,
  });

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
}
