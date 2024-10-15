import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useWebSocketSubscription } from "../hooks/useWebSocketSubscription.jsx";
import "../stylesheets/ChatMessages.css";
import { useScrollable } from "../hooks/useScrollable.jsx";

export function ChatMessages({ id, chatMessages, setChatMessages }) {
  const channelIdentifier = useMemo(
    () => ({
      channel: "ChatChannel",
      chat_id: id,
    }),
    [id]
  );

  const channelMessage = useWebSocketSubscription(channelIdentifier);

  const { user } = useSelector((state) => state.auth);
  const scrollableRef = useRef(null);
  const scrollableBottomRef = useRef(null);
  const autoScroll = useScrollable(scrollableRef, scrollableBottomRef);

  // Inserts the chat message received from the WebSockets channel
  useEffect(() => {
    if (channelMessage) {
      const chat_message = channelMessage.message.chat_message;
      setChatMessages((state) => [chat_message, ...state]);
    }
  }, [channelMessage]);

  // Adjusts the scroll position to the newly received message
  useEffect(() => {
    if (autoScroll)
      scrollableBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <section
      id="chat-messages"
      className="overflow-anchor-none overflow-auto h-full p-4"
      ref={scrollableRef}
    >
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
                style={{ wordBreak: "break-word" }}
              >
                {message.content}
              </p>
            </li>
          );
        })}
      </ul>
      <div ref={scrollableBottomRef}></div>
    </section>
  );
}

export default ChatMessages;
