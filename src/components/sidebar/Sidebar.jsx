import SearchForm from "./SearchForm";
import ChatSelection from "./ChatSelection.jsx";
import UserInfoPanel from "./UserInfoPanel.jsx";
import QueryResults from "./QueryResults.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setSearchMode as setSearchModeReducer } from "../../features/sidebar/sidebarSlice";

export function Sidebar() {
  const searchMode = useSelector((state) => state.sidebar.searchMode);
  const dispatch = useDispatch();
  const setSearchMode = (searchMode) =>
    dispatch(setSearchModeReducer(searchMode));

  return (
    <aside
      className={[
        "flex",
        "flex-col",
        "overflow-hidden",
        "w-96",
        "shrink-0",
        "h-full",
        "bg-gray-900/[.8]",
        "rounded-lg",
      ].join(" ")}
    >
      <header
        className={[
          "p-4",
          "border-b",
          "border-gray-400/[.8]",
          "space-y-2",
        ].join(" ")}
      >
        <h2 className={["text-xl", "font-bold", "text-white"].join(" ")}>
          Chats
        </h2>
        <SearchForm searchMode={searchMode} setSearchMode={setSearchMode} />
      </header>

      <nav className={["overflow-y-auto", "h-full", "p-4"].join(" ")}>
        {searchMode ? <QueryResults /> : <ChatSelection />}
      </nav>

      <footer
        className={[
          "flex",
          "flex-row",
          "p-4",
          "border-t",
          "border-gray-400/[.8]",
        ].join(" ")}
      >
        <UserInfoPanel />
      </footer>
    </aside>
  );
}

export default Sidebar;
