import "../stylesheets/ChatBar.css";
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { postChatMessage } from "../services/chatMessagesService";

export function ChatBar() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { id } = useParams();
  const messageBoxRef = useRef(null);

  const updateMessage = (event) => {
    const content = event.target.innerText.trim();
    setMessage(content);
  };

  const submitMessage = async () => {
    if (sending) return;
    setSending(true);
    try {
      await postChatMessage(id, message);
      messageBoxRef.current.innerText = "";
      setMessage("");
    } catch (error) {
      console.error("Error sending data.");
    }
    setSending(false);
    setTimeout(() => {
      messageBoxRef.current.focus();
    }, 0);
  };

  const buttonSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  };

  const keystrokeSubmit = (event) => {
    if (!event.shiftKey && event.key == "Enter") {
      event.preventDefault();
      submitMessage();
    }
  };

  useEffect(() => {
    messageBoxRef.current.focus();
  }, []);

  return (
    <form className="w-full" onSubmit={buttonSubmit}>
      <div className="flex items-end px-3 py-2">
        <button
          type="button"
          className={[
            "inline-flex",
            "justify-center",
            "p-2",
            "text-gray-500",
            "rounded-lg",
            "cursor-pointer",
            "hover:text-gray-900",
            "hover:bg-gray-100",
            "dark:text-gray-400",
            "dark:hover:text-white",
            "dark:hover:bg-gray-600",
          ].join(" ")}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              fill="currentColor"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
          </svg>
          <span className="sr-only">Upload image</span>
        </button>
        <button
          type="button"
          className={[
            "p-2",
            "text-gray-500",
            "rounded-lg",
            "cursor-pointer",
            "hover:text-gray-900",
            "hover:bg-gray-100",
            "dark:text-gray-400",
            "dark:hover:text-white",
            "dark:hover:bg-gray-600",
          ].join(" ")}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
            />
          </svg>
          <span className="sr-only">Add emoji</span>
        </button>

        <div
          role="textarea"
          onInput={updateMessage}
          onKeyDown={keystrokeSubmit}
          ref={messageBoxRef}
          className={[
            "mx-4",
            "p-2.5",
            "w-full",
            "max-h-32",
            "overflow-y-auto",
            "text-sm",
            "text-white",
            "rounded-sm",
            "outline-none",
            "focus:ring-4",
            "ring-purple-500",
            "focus:border-purpler-500",
          ].join(" ")}
          placeholder="Aa"
          contentEditable={!sending}
        ></div>

        <button
          type="submit"
          id="submit-message-button"
          className={[
            "inline-flex",
            "justify-center",
            "p-2",
            "text-blue-600",
            "rounded-full",
            "cursor-pointer",
            "hover:bg-blue-100",
            "disabled:dark:bg-gray-500",
            "disabled:dark:text-gray-400",
            "dark:text-blue-500",
            "dark:hover:bg-purple-600",
          ].join(" ")}
          disabled={sending}
        >
          <svg
            className="w-5 h-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
}

export default ChatBar;
