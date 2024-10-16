import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import { getChatMessages } from "../services/chatMessagesService";
import { getChat } from "../services/chatsService";
import ChatMessages from "./ChatMessages.jsx";

export function ChatWindow() {
  const { id } = useParams();

  const [chatMessages, setChatMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const fetchMessages = async () => {
    try {
      const _chatMessages = await getChatMessages(id);
      setChatMessages(_chatMessages);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const fetchChat = async () => {
    try {
      const _chat = await getChat(id);
      setChat(_chat);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const fetchEverything = async () => {
    setLoading(true);
    await Promise.all([fetchChat(), fetchMessages()]);
    setLoading(false);
  };

  useEffect(() => {
    if (chat) {
      const otherUser_ = chat.users.find((u) => user.id != u.id);
      setOtherUser(otherUser_);
    }
  }, [chat]);

  useEffect(() => {
    fetchEverything();
  }, [id]);

  const loadingPlaceholder = (
    <span className="p-4 text-white animate-pulse">Loading...</span>
  );

  const errorPlaceholder = (
    <span className="p-4 text-white">Error: Cannot load chat.</span>
  );

  const template = (
    <>
      <header className="flex flex-row gap-4 items-start p-4 border-b border-gray-400/[.8] space-y-2">
        <div>
          <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-white leading-none">
          {otherUser?.full_name}
        </h2>
      </header>
      <ChatMessages
        id={id}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
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
