import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import { getChat } from "../services/chatsService";
import ChatMessages from "./ChatMessages.jsx";
import { SharedChannelSubscriptionsContext } from "../contexts/SharedChannelSubscriptionsContext.jsx";

export function ChatWindow() {
  const { id } = useParams();

  const { presenceUpdates } = useContext(SharedChannelSubscriptionsContext);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const fetchChat = async () => {
    try {
      const _chat = await getChat(id);
      setChat(_chat);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const fetchAsync = async () => {
    setLoading(true);
    await fetchChat();
    setLoading(false);
  };

  useEffect(() => {
    if (chat) {
      const otherUser_ = chat.users.find((u) => user.id != u.id);
      setOtherUser(otherUser_);
    }
  }, [chat]);

  useEffect(() => {
    const presenceStatus = presenceUpdates?.message;
    if (presenceStatus?.id === otherUser?.id) {
      setOtherUser((_otherUser) => ({ ..._otherUser, ...presenceStatus }));
    }
  }, [presenceUpdates]);

  useEffect(() => {
    fetchAsync();
  }, [id]);

  const loadingPlaceholder = (
    <span className="p-4 text-white animate-pulse">Loading...</span>
  );

  const errorPlaceholder = (
    <span className="p-4 text-white">Error: Cannot load chat.</span>
  );

  const template = (
    <>
      <header className="flex flex-row gap-4 items-start p-4 border-b border-gray-400/[.8]">
        <div className="relative">
          <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
          <div
            data-testid="chat-presence-indicator"
            className={[
              "absolute",
              "bottom-0",
              "right-0",
              "rounded-full",
              "h-3",
              "w-3",
              "border-2",
              "border-white",
              otherUser?.presence ? "bg-green-500" : "bg-gray-500",
            ].join(" ")}
          ></div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white leading-none ">
            {otherUser?.full_name}
          </h2>
          <span className="text-gray-400 user-handle">{otherUser?.handle}</span>
          {otherUser?.presence ? (
            <span className="text-green-400 text-xs">Online</span>
          ) : (
            <span className="text-gray-500 text-xs">
              Last seen {new Date(otherUser?.last_seen).toLocaleString()}
            </span>
          )}
        </div>
      </header>
      <ChatMessages id={id} />
      <footer className="flex flex-row border-t border-gray-400/[.8]">
        <ChatBar />
      </footer>
    </>
  );

  if (loading) return loadingPlaceholder;
  else if (chat) return template;
  else return errorPlaceholder;
}

export default ChatWindow;
