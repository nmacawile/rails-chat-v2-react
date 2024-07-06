import "../stylesheets/ChatWindow.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import { getChatMessages } from "../services/chatMessagesService";
import { getChat } from "../services/chatsService";

export function ChatWindow() {
  const { id } = useParams();
  const [chatMessages, setChatMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
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
    fetchEverything();
  }, [id]);

  return loading ? (
    <span className="p-4 text-white animate-pulse">Loading...</span>
  ) : (
    <>
      <header className="flex flex-row gap-4 items-start p-4 border-b border-gray-400/[.8] space-y-2">
        <div>
          <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-white leading-none">
          {chat && chat.users[0].full_name}
        </h2>
      </header>
      <section className="overflow-auto h-full p-4">
        <ul className="flex flex-col-reverse gap-1 justify-start">
          {chatMessages.map((message, i) => {
            return (
              <li
                key={"chat-message-" + i}
                className={[
                  `user-${message.id}`,
                  "max-w-[70%]",
                  message.user.id === user.id ? "message mine" : "message",
                ].join(" ")}
              >
                <p
                  className={[
                    "inline-block",
                    "py-2",
                    "px-4",
                    "bg-pink-800",
                    "text-white",
                    "whitespace-pre-wrap",
                  ].join(" ")}
                >
                  {message.content}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
      <footer className="flex flex-row border-t border-gray-400/[.8]">
        <ChatBar />
      </footer>
    </>
  );
}

export default ChatWindow;
