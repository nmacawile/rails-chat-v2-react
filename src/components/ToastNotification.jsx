import "../stylesheets/ToastNotification.css";
import { Link } from "react-router-dom";

export function ToastNotification({ data, exiting, remove }) {
  const latestMessage = data.chat.latest_message;
  const user = latestMessage.user;
  const content = latestMessage.content;
  const chatId = data.chat.id;

  const close = (e) => {
    remove();
  };

  return (
    <div
      className={[
        "grid",
        "grid-cols-[1fr_auto]",
        "toast-notification",
        "z-[999]",
        "shadow-lg",
        "rounded-lg",
        "overflow-hidden",
        "bg-gray-800",
        "h-18",
        "hover:bg-gray-700",
        "text-gray-400",
        "cursor-pointer",
        "select-none",
        "p-4",
        exiting ? "fade-out" : "not-fade-out",
      ].join(" ")}
      role="alert"
    >
      <Link
        onClick={close}
        to={`/chats/${chatId}`}
        data-testid={`chat-${chatId}-link`}
      >
        <div className="  inner">
          <div className="flex">
            <div className="w-8 h-8 shrink-0 p-0 rounded-full bg-purple-500"></div>
            <div className="ms-3 text-sm font-normal overflow-hidden">
              <div className="flex flex-col mb-1">
                <span className="text-sm font-semibold text-white leading-none">
                  {user.full_name}
                </span>
                <span className="user-handle text-xs text-gray-400">
                  {user.handle}
                </span>
              </div>
              <div className="font-normal whitespace-nowrap text-ellipsis overflow-hidden border-red-200">
                {content}
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={close}
        type="button"
        className="justify-center items-center text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-message-cta"
        data-testid={`chat-${chatId}-notification-close-button`}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
