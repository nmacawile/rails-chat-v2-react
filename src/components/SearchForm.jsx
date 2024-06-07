export function SearchForm() {
  return (
    <form className="">
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
        <input
          type="search"
          id="input-group-1"
          className={[
            "block",
            "bg-gray-50",
            "border",
            "border-gray-300",
            "text-gray-900",
            "text-sm",
            "rounded-full",
            "focus:ring-4",
            "focus:ring-blue-500",
            "focus:border-blue-500",
            "w-full",
            "ps-12",
            "p-2.5",
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
      </div>
    </form>
  );
}

export default SearchForm;
