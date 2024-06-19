import { useEffect, useState } from "react";
import { getChats } from "../services/chatsService";
import SearchForm from "./SearchForm";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function ChatSelection() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth_user = useSelector((state) => state.auth.user);

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

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <aside className="flex flex-col overflow-hidden w-96 shrink-0 h-full bg-gray-900/[.8] rounded-lg ">
      <header className="p-4 border-b border-gray-400/[.8] space-y-2">
        <h2 className="text-xl font-bold text-white">Chats</h2>
        <SearchForm />
      </header>

      <nav className="overflow-y-auto h-full p-4">
        {loading ? (
          <span className="text-white animate-pulse">Loading...</span>
        ) : (
          <ul className="flex flex-col align-center gap-2">
            {chats.map((chat) => {
              return (
                <li key={`chat-${chat.id}`}>
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
                    <div>
                      <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
                    </div>
                    <div className="ms-2.5 flex flex-col overflow-hidden">
                      <span className="leading-none text-white font-semibold">
                        {
                          chat.users.filter((u) => u.id !== auth_user.id)[0]
                            .full_name
                        }
                      </span>
                      <p className="text-gray-400 group-hover:text-gray-50 whitespace-nowrap overflow-hidden text-ellipsis transition-all">
                        {chat.latest_message.content}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <footer className="flex flex-row p-4 border-t border-gray-400/[.8]">
        <div>
          <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
        </div>
        <span className="ms-2.5 leading-none text-white">
          {auth_user.full_name}
        </span>
      </footer>
    </aside>
  );
}

export default ChatSelection;
