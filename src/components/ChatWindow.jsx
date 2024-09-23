import "../stylesheets/ChatWindow.css";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import { getChatMessages } from "../services/chatMessagesService";
import { getChat } from "../services/chatsService";
import { ReadyState } from "react-use-websocket";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { dataFilter, messageFormatter } from "../helpers/webSocketHelpers";

const SubscriptionState = { UNSUBSCRIBED: 0, SUBSCRIBING: 1, SUBSCRIBED: 2 };

export function ChatWindow() {
  const { id } = useParams();
  const [chatMessages, setChatMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { sendMessage, lastMessage, readyState } = useContext(WebSocketContext);
  const subscriptionRef = useRef(SubscriptionState.UNSUBSCRIBED);
  // Reference to the scrollable element
  const scrollableRef = useRef(null);
  // Stores the last known position of the view inside the scrollable element
  const lastScrollPosition = useRef(null);
  // Determines whether to lock scroll position in place or not
  const [lockScrollPosition, setLockScrollPosition] = useState(false);

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

  // Filters and displays incoming WebSocket messages
  // 'sendMessage' is listed as a dependency
  // to mirror the update of the WebSocket instance
  // in case of a reconnection.
  const chatMessageHandler = useCallback(
    (data) => {
      const filtered = dataFilter(
        ({ identifier, message }) => message && identifier.chat_id == id,
        data
      );
      if (filtered) {
        const chat_message = filtered.message.chat_message;
        setChatMessages((state) => [chat_message, ...state]);
      }
    },
    [sendMessage, id, setChatMessages]
  );

  // Prevent duplication of subscriptions caused by React's Strict Mode
  const subscriptionConfirmationListener = useCallback(
    (data) => {
      const filtered = dataFilter(
        ({ identifier, type }) =>
          identifier.chat_id == id && type === "confirm_subscription",
        data
      );
      if (filtered) {
        // console.log(`Subscribed to Chat id ${id}.`);
        subscriptionRef.current = SubscriptionState.SUBSCRIBED;
      }
    },
    [sendMessage, id, setChatMessages]
  );

  // Sends a 'subscribe' command to the WebSocket server
  const subscribeToChannel = useCallback(() => {
    if (subscriptionRef.current === SubscriptionState.UNSUBSCRIBED) {
      subscriptionRef.current = SubscriptionState.SUBSCRIBING;
      // console.log(`Subscribing to Chat id ${id}...`);
      sendMessage(
        messageFormatter("subscribe", {
          channel: "ChatChannel",
          chat_id: id,
        })
      );
    }
  }, [sendMessage, id]);

  // Sends an 'unsubscribe' command to the WebSocket server
  const unsubscribeFromChannel = useCallback(() => {
    if (subscriptionRef.current === SubscriptionState.SUBSCRIBED) {
      subscriptionRef.current = SubscriptionState.UNSUBSCRIBED;
      // console.log(`Unsubscribed from Chat id ${id}.`);
      sendMessage(
        messageFormatter("unsubscribe", {
          channel: "ChatChannel",
          chat_id: id,
        })
      );
    }
  }, [sendMessage, id]);

  // Handles incoming WebSocket messages
  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      chatMessageHandler(data);
      subscriptionConfirmationListener(data);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (chat) {
      const otherUser_ = chat.users.find((u) => user.id != u.id);
      setOtherUser(otherUser_);
    }
  }, [chat]);

  // Updates the scrollPosition and sets the state of scroll lock
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    lastScrollPosition.current = scrollTop;
    setLockScrollPosition(scrollTop + clientHeight !== scrollHeight);
  };

  // Moves the scroll view to the bottom of the scrollable element
  const scrollToBottom = () => {
    if (scrollableRef.current) {
      const { scrollHeight, clientHeight } = scrollableRef.current;
      scrollableRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  // Initializes the scroll view position to the bottom of the scrollable element
  useEffect(() => {
    if (chatMessages.length && lastScrollPosition.current === null) {
      scrollToBottom();
    }
  }, [chatMessages]);

  // Subscribes to the WebSocket server
  // Unsubscribes when 'id' parameter updates
  // Automatically subscribes on reconnection
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribeToChannel();
      return () => {
        unsubscribeFromChannel();
      };
    }
  }, [id, readyState]);

  // Set scroll position lock to 'false' initially.
  // The window scrolls to the newest message automatically
  // as the client receives a message from the WebSocket
  useEffect(() => {
    fetchEverything();
    setLockScrollPosition(false);

    return () => {
      lastScrollPosition.current = null;
    };
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
      <section
        className="overflow-auto h-full p-4"
        ref={scrollableRef}
        onScroll={handleScroll}
        style={{ overflowAnchor: lockScrollPosition ? "none" : "auto" }}
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

  if (loading) return loadingPlaceholder;
  else if (chat) return template;
  else return errorPlaceholder;
}

export default ChatWindow;
