import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, act, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { ChatMessages } from "./ChatMessages.jsx";
import { authUserFixture } from "../../tests/fixtures/usersFixture";
import { chatsFixture } from "../../tests/fixtures/chatsFixture";
import { chatMessagesFixture } from "../../tests/fixtures/chatMessagesFixture";
import { getChat } from "../services/chatsService";
import { getChatMessages } from "../services/chatMessagesService";
import { WebSocketContext } from "../contexts/WebSocketContext.jsx";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

vi.mock("../services/chatsService");
vi.mock("../services/chatMessagesService");
const mockStore = configureMockStore([]);
window.HTMLElement.prototype.scrollIntoView = function () {};

describe("ChatMessages Component", () => {
  const chatId = "1";

  const fetchChatMessages = (chatId) =>
    chatMessagesFixture.filter((m) => m.messageable_id == chatId);

  const commandMessage = (command, id) =>
    JSON.stringify({
      command: command,
      identifier: JSON.stringify({ channel: "ChatChannel", chat_id: "" + id }),
    });

  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  let changeMessage;
  let sendMessage = vi.fn();

  const TestComponent = () => {
    const [lastMessage, setLastMessage] = useState(null);
    const [chatMessages, setChatMessages] = useState(fetchChatMessages(chatId));
    const readyState = 1; // OPEN

    useEffect(() => {
      changeMessage = setLastMessage;
      return () => {
        changeMessage = null;
      };
    }, []);

    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/chats/${chatId}`]}>
          <Routes>
            <Route
              path="/chats/:id"
              element={
                <WebSocketContext.Provider
                  value={{ lastMessage, readyState, sendMessage }}
                >
                  <ChatMessages
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    id={chatId}
                  />
                </WebSocketContext.Provider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  const renderComponent = () => render(<TestComponent />);

  it("shows the chat messages", async () => {
    await act(() => renderComponent());
    const chatMessages = fetchChatMessages(chatId);
    chatMessages.forEach((m) => {
      const content = screen.getByText(m.content);
      expect(content).toBeInTheDocument();
    });
  });

  it("subscribes to the Chat channel on mount", async () => {
    await act(() => renderComponent());

    expect(sendMessage).toHaveBeenCalledWith(
      commandMessage("subscribe", chatId)
    );
  });

  it("displays the received chat message", async () => {
    await act(() => renderComponent());
    changeMessage({
      data: JSON.stringify({
        identifier: JSON.stringify({ channel: "ChatChannel", chat_id: "1" }),
        message: {
          chat_message: {
            id: 999,
            content: "How's it going?",
            user: authUserFixture,
            created_at: "2024-09-12T15:53:47.413Z",
          },
        },
      }),
    });

    await waitFor(() => {
      expect(screen.getByText("How's it going?")).toBeInTheDocument();
    });
  });

  it("doesn't display the received chat message for a different chat id", async () => {
    await act(() => renderComponent());

    changeMessage({
      data: JSON.stringify({
        identifier: JSON.stringify({ channel: "ChatChannel", chat_id: "199" }),
        message: {
          chat_message: {
            id: 999,
            content: "How's it going?",
            user: authUserFixture,
            created_at: "2024-09-12T15:53:47.413Z",
          },
        },
      }),
    });

    await waitFor(() => {
      expect(screen.getByText("Hey!!!")).toBeInTheDocument();
    });

    const messageElement = screen.queryByText("How's it going?");
    expect(messageElement).toBeNull();
  });
});
