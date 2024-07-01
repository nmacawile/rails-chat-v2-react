import { useEffect, useState } from "react";
import { queryUsers } from "../../services/queryService";

import { useSelector } from "react-redux";

export function QueryResults() {
  const query = useSelector((state) => state.sidebar.query);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const sendUserQueryRequest = async () => {
    setLoading(true);
    try {
      const _users = await queryUsers(query);
      setUsers(_users);
    } catch (error) {
      console.error("Error loading data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    sendUserQueryRequest();
  }, [query]);

  return (
    <>
      {loading ? (
        <span className="text-white animate-pulse">Loading...</span>
      ) : (
        <ul className="flex flex-col gap-2 text-white">
          {users.map((user, index) => (
            <li key={`query-result-${index}`}>
              <a
                href="#"
                className={[
                  "group",
                  "flex",
                  "flex-row",
                  "w-full",
                  "p-2",
                  "rounded-lg",
                  "hover:bg-pink-700/[.8]",
                ].join(" ")}
              >
                <div className="w-8 h-8 bg-purple-400 me-2 rounded-full"></div>
                <div className="flex flex-col">
                  <span className="font-semibold text-md leading-none">
                    {user.full_name}
                  </span>
                  <span className="group-hover:text-white text-gray-400 text-sm">
                    @{user.handle}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default QueryResults;
