import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useWebSocketSubscription } from "../hooks/useWebSocketSubscription.jsx";
import "../stylesheets/ChatMessages.css";
import { useScrollable } from "../hooks/useScrollable.jsx";
import { getChatMessages } from "../services/chatMessagesService";

export function ChatMessages({ id }) {
  const { user } = useSelector((state) => state.auth);
  const scrollableRef = useRef(null);
  const scrollableBottomRef = useRef(null);
  const {
    scrollPosition,
    triggerAutoScroll,
    scrollToBottom,
    readjustPositionAfterPrepending,
  } = useScrollable(scrollableRef, scrollableBottomRef);

  const [chatMessages, setChatMessages] = useState([]);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneInitialLoading, setDoneInitialLoading] = useState(false);

  const initializedRef = useRef(false);
  const channelIdentifier = useMemo(
    () => ({
      channel: "ChatChannel",
      chat_id: id,
    }),
    [id]
  );

  const channelMessage = useWebSocketSubscription(channelIdentifier);

  const oldestMessageId = useMemo(() => {
    const chatMessagesCount = chatMessages.length;
    if (chatMessagesCount) return chatMessages[chatMessagesCount - 1].id;
  }, [chatMessages]);

  const fetchMessagesBatch = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        const messagesBatch = await getChatMessages(id, oldestMessageId);
        setChatMessages((state) => [...state, ...messagesBatch]);
        setHasOlderMessages(messagesBatch.length === 20);
      } catch (error) {
        console.error("Error loading data", error);
      }
      setLoading(false);
    }
  }, [loading, oldestMessageId]);

  const loadPreviousMessages = useCallback(() => {
    if (hasOlderMessages) readjustPositionAfterPrepending(fetchMessagesBatch);
  }, [hasOlderMessages, fetchMessagesBatch, readjustPositionAfterPrepending]);

  const loadInitialMessages = async () => {
    await fetchMessagesBatch();
    setDoneInitialLoading(true);
    scrollToBottom();
  };

  // Inserts the chat message received from the WebSockets channel
  useEffect(() => {
    if (channelMessage) {
      const chat_message = channelMessage.message.chat_message;
      setChatMessages((state) => [chat_message, ...state]);
    }
  }, [channelMessage]);

  // Adjusts the scroll position to the newly received message
  useEffect(() => {
    triggerAutoScroll();
  }, [chatMessages]);

  useEffect(() => {
    if (scrollPosition === "top") {
      loadPreviousMessages();
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadInitialMessages();
    }
  }, []);

  const messagesPlaceholder = (
    <div className="text-white animate-pulse">Loading messages...</div>
  );

  const loadPreviousMessagesButton = (
    <button
      onClick={loadPreviousMessages}
      className={[
        "block",
        "text-white",
        "mx-auto",
        "mb-4",
        "font-semibold",
        "bg-purple-400",
        "hover:bg-purple-300",
        "px-4",
        "py-2",
        "rounded-md",
        "disabled:bg-gray-500",
        "disabled:animate-pulse",
      ].join(" ")}
      disabled={loading}
    >
      {loading ? "Loading..." : "Load older messages"}
    </button>
  );

  const messagesTemplate = (
    <>
      {hasOlderMessages && loadPreviousMessagesButton}
      <ul className="flex flex-col-reverse gap-1 justify-start">
        {chatMessages.map((message) => {
          return (
            <li
              key={"chat-message-" + message.id}
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
                style={{ wordBreak: "break-word" }}
              >
                {message.content}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <section
      id="chat-messages"
      className="overflow-anchor-none overflow-auto h-full p-4"
      ref={scrollableRef}
    >
      {!doneInitialLoading ? messagesPlaceholder : messagesTemplate}
      <div ref={scrollableBottomRef}></div>
    </section>
  );
}

export default ChatMessages;
