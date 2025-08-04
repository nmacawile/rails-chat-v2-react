import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useContext, useEffect } from "react";

import { SharedChannelSubscriptionsContext } from "../../contexts/SharedChannelSubscriptionsContext";

export function ChatSelectionItem({ chat, updateChat }) {
  const auth_user = useSelector((state) => state.auth.user);

  const { presenceUpdates } = useContext(SharedChannelSubscriptionsContext);
  const otherUser = chat.users.find((u) => u.id !== auth_user.id);

  useEffect(() => {
    const presenceStatus = presenceUpdates?.message;
    if (presenceStatus?.id === otherUser.id) {
      const updatedUser = { ...otherUser, ...presenceStatus };
      const updatedChat = { ...chat, users: [auth_user, updatedUser] };
      updateChat(updatedChat);
    }
  }, [presenceUpdates]);

  return (
    <li>
      <Link
        to={`/chats/${chat.id}`}
        data-testid={`chat-${chat.id}-link`}
        className={[
          "group",
          "flex",
          "p-2",
          "rounded-lg",
          "w-full",
          "hover:bg-pink-700/[.8]",
          "transition-all",
          "duration-300",
        ].join(" ")}
      >
        <div className="relative">
          <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
          <div
            data-testid="presence-indicator"
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
        <div className="ms-2.5 flex flex-col overflow-hidden">
          <span className="leading-none text-white font-semibold">
            {otherUser.full_name}
          </span>
          <p className="text-gray-400 group-hover:text-gray-50 whitespace-nowrap overflow-hidden text-ellipsis transition-all">
            {chat.latest_message.content}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default ChatSelectionItem;
