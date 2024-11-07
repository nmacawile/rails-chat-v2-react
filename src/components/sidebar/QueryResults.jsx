import { useEffect, useState, useRef, useCallback } from "react";
import { queryUsers } from "../../services/queryService";
import { useScrollable } from "../../hooks/useScrollable.jsx";

import { useSelector } from "react-redux";
import UserQueryItem from "./UserQueryItem.jsx";

export function QueryResults() {
  const query = useSelector((state) => state.sidebar.query);
  const [users, setUsers] = useState([]);
  const [doneInitialLoading, setDoneInitialLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollableRef = useRef(null);
  const autoScrollAnchorRef = useRef(null);
  const { scrollPosition } = useScrollable(scrollableRef, autoScrollAnchorRef, {
    threshold: 64,
    defaultPosition: "top",
    debouncerTimeout: 300,
  });
  const page = useRef(1);
  const perPage = 20;

  const sendUserQueryRequest = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        const results = await queryUsers(query, {
          page: page.current,
          per_page: perPage,
        });
        setHasMoreResults(results.length === perPage);
        setUsers((state) => [...state, ...results]);
      } catch (error) {
        console.error("Error loading data", error);
      }
      setLoading(false);
    }
  }, [query, loading]);

  const loadInitialQueryResults = useCallback(async () => {
    setDoneInitialLoading(false);
    await sendUserQueryRequest();
    setDoneInitialLoading(true);
  }, [sendUserQueryRequest]);

  useEffect(() => {
    page.current = 1;
    setUsers([]);
    loadInitialQueryResults();
  }, [query]);

  useEffect(() => {
    if (scrollPosition === "bottom") {
      page.current++;
      sendUserQueryRequest();
    }
  }, [scrollPosition]);

  const sendUserQueryRequestButton = (
    <button
      onClick={sendUserQueryRequest}
      className={[
        "block",
        "text-white",
        "mx-auto",
        "mt-4",
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
      {loading ? "Loading..." : "Load more results"}
    </button>
  );

  return (
    <nav
      className={["overflow-y-auto", "h-full", "p-4"].join(" ")}
      ref={scrollableRef}
    >
      {!doneInitialLoading ? (
        <span className="text-white animate-pulse">Loading...</span>
      ) : (
        <>
          <ul className="flex flex-col gap-2 text-white">
            {users.map((user, index) => (
              <UserQueryItem user={user} key={`query-result-${index}`} />
            ))}
          </ul>
          {hasMoreResults && sendUserQueryRequestButton}
        </>
      )}
    </nav>
  );
}

export default QueryResults;
