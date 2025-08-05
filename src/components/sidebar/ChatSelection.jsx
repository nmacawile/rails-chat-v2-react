import { useEffect, useState, useContext } from "react";
import { getChats } from "../../services/chatsService";
import ChatSelectionItem from "./ChatSelectionItem.jsx";
import { SharedChannelSubscriptionsContext } from "../../contexts/SharedChannelSubscriptionsContext.jsx";

export function ChatSelection() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { notifications } = useContext(SharedChannelSubscriptionsContext);

  const loadChats = async () => {
    setLoading(true);
    try {
      const userChats = await getChats();
      setChats(userChats);
    } catch (error) {
      console.error("Error loading data", error);
    }
    setLoading(false);
  };

  const updateChat = (index, chat) => {
    setChats((state) => {
      const chatListSize = state.length;
      return [
        ...state.slice(0, index),
        chat,
        ...state.slice(index + 1, chatListSize),
      ];
    });
  };

  const appendChat = (chat) => {
    setChats((state) => [chat, ...state]);
  };

  useEffect(() => {
    if (notifications) {
      const { chat } = notifications.message;
      const index = chats.findIndex((c) => c.id === chat.id);
      if (index >= 0) updateChat(index, chat);
      else appendChat(chat);
    }
  }, [notifications]);

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <nav className={["overflow-y-auto", "h-full", "p-4"].join(" ")}>
      {loading ? (
        <span className="text-white animate-pulse">Loading...</span>
      ) : (
        <ul className="flex flex-col align-center gap-2">
          {chats.map((chat, index) => (
            <ChatSelectionItem
              chat={chat}
              updateChat={(chat) => updateChat(index, chat)}
              key={`chat-${chat.id}`}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

export default ChatSelection;
