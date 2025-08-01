import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useMemo, useRef } from "react";
import { setSearchMode, setQuery } from "../../features/sidebar/sidebarSlice";
import debouncer from "../../lib/debouncer";

export function SearchForm() {
  const searchMode = useSelector((state) => state.sidebar.searchMode);
  const [inputValue, setInputValue] = useState("");
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const debouncedDispatch = useCallback(debouncer(dispatch), [dispatch]);

  const onSearchInputClick = () => dispatch(setSearchMode(true));
  const onBackButtonClick = () => {
    dispatch(setSearchMode(false));
    setInputValue("");
    debouncedDispatch(setQuery(""));
  };

  const onSearchInputChange = (event) => {
    if (!searchMode) dispatch(setSearchMode(true));
    const newQuery = event.target.value;
    setInputValue(newQuery);
    debouncedDispatch(setQuery(newQuery));
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
  };

  const onFormClear = (event) => {
    setInputValue("");
    debouncedDispatch(setQuery(""));
    searchInputRef.current.focus();
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      {searchMode && (
        <button
          type="button"
          id="search-back-button"
          onClick={onBackButtonClick}
          className={[
            "text-white",
            "bg-blue-700",
            "hover:bg-blue-800",
            "focus:ring-4",
            "focus:outline-none",
            "focus:ring-blue-300",
            "font-medium",
            "rounded-full",
            "text-sm",
            "p-2.5",
            "text-center",
            "inline-flex",
            "items-center",
            "me-2",
            "dark:bg-blue-600",
            "dark:hover:bg-blue-700",
            "dark:focus:ring-blue-800",
          ].join(" ")}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M5 12l4-4m-4 4 4 4"
            />
          </svg>

          <span className="sr-only">Back</span>
        </button>
      )}

      <form id="search-form" className="w-full" onSubmit={onFormSubmit}>
        <div className="relative">
          <div
            className={[
              "absolute",
              "inset-y-0",
              "start-0",
              "flex",
              "items-center",
              "ps-3.5",
              "pointer-events-none",
            ].join(" ")}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <div className={["flex"].join(" ")}>
            <input
              type="text"
              id="search-input"
              ref={searchInputRef}
              value={inputValue}
              onChange={onSearchInputChange}
              onClick={onSearchInputClick}
              className={[
                "block",
                "w-full",
                "rounded-full",
                "bg-gray-50",
                "border",
                "border-gray-300",
                "text-gray-900",
                "text-sm",
                "focus:ring-4",
                "focus:ring-blue-500",
                "focus:border-blue-500",
                "px-12",
                "py-2.5",
                "outline-none",
                "dark:bg-gray-700",
                "dark:border-gray-600",
                "dark:placeholder-gray-400",
                "dark:text-white",
                "dark:focus:ring-purple-800",
                "dark:focus:border-purple-800",
              ].join(" ")}
              placeholder="Search Users"
            />
            {inputValue !== "" && (
              <button
                id="search-input-clear-button"
                type="button"
                className={[
                  "absolute",
                  "inset-y-0",
                  "end-0",
                  "flex",
                  "items-center",
                  "pe-3",
                ].join(" ")}
                onClick={onFormClear}
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-gray-500 dark:hover:text-white "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
