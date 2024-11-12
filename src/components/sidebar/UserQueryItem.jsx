import { useNavigate } from "react-router-dom";
import { findOrCreateChat } from "../../services/chatsService.js";

export function UserQueryItem({ user }) {
  const navigate = useNavigate();

  const navigateToChat = async () => {
    let chatId;
    try {
      const chat = await findOrCreateChat(user.id);
      chatId = chat.id;
    } catch (error) {
      console.error("Error loading data", error);
    }
    if (chatId) navigate(`/chats/${chatId}`);
  };

  return (
    <li>
      <button
        className={[
          "group",
          "flex",
          "flex-row",
          "w-full",
          "p-2",
          "rounded-lg",
          "hover:bg-pink-700/[.8]",
        ].join(" ")}
        onClick={() => navigateToChat()}
      >
        <div className="w-8 h-8 bg-purple-400 me-2 rounded-full"></div>
        <div className="flex flex-col text-left">
          <span className="font-semibold text-md leading-none">
            {user.full_name}
          </span>
          <span className="group-hover:text-white text-gray-400 text-sm user-handle">
            {user.handle}
          </span>
        </div>
      </button>
    </li>
  );
}

export default UserQueryItem;
