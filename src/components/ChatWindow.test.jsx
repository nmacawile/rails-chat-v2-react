import { describe, it, expect, vi, afterEach } from "vitest";
import {
  screen,
  act,
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import ChatWindow from "./ChatWindow.jsx";
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

describe("ChatWindow Component", () => {
  const chatId = 1;
  const chat2Id = 2;

  const fetchChat = (chatId) => chatsFixture.find((c) => c.id == chatId);
  const fetchChatMessages = (chatId) =>
    chatMessagesFixture.filter((m) => m.messageable_id == chatId);

  const fetchOtherUser = (chatId) => {
    const chat = fetchChat(chatId);
    return chat.users.find((u) => u.id !== authUserFixture.id);
  };

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

    const [readyState, setReadyState] = useState(1); // OPEN

    useEffect(() => {
      changeMessage = setLastMessage;
      return () => {
        changeMessage = null;
      };
    }, []);

    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/chats/${chatId}`]}>
          <Link to={`/chats/${chat2Id}`}>Switch Chats</Link>
          <Routes>
            <Route
              path="/chats/:id"
              element={
                <WebSocketContext.Provider
                  value={{ lastMessage, readyState, sendMessage }}
                >
                  <ChatWindow />
                </WebSocketContext.Provider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  getChat = vi.fn().mockImplementation((id) => {
    const chat = fetchChat(id);
    return Promise.resolve(chat);
  });

  getChatMessages = vi.fn().mockImplementation((id) => {
    const chatMessages = fetchChatMessages(id);
    return Promise.resolve(chatMessages);
  });

  const renderComponent = () => {
    render(<TestComponent />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a placeholder while loading", () => {
    renderComponent();
    const placeholder = screen.getByText("Loading...");
    expect(placeholder).toBeInTheDocument();
  });

  it("shows the name of the other chat user", async () => {
    await act(() => renderComponent());
    const otherUser = fetchOtherUser(chatId);
    const otherUserFullName = screen.getByText(otherUser.full_name);

    expect(otherUserFullName).toBeInTheDocument();
  });

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

  it("unsubscribes from the Chat channel on unmount", async () => {
    renderComponent();

    await act(() => {
      changeMessage({
        data: JSON.stringify({
          identifier: JSON.stringify({ channel: "ChatChannel", chat_id: "1" }),
          type: "confirm_subscription",
        }),
      });
    });

    expect(sendMessage).toHaveBeenCalledWith(
      commandMessage("subscribe", chatId)
    );

    const link = screen.getByText("Switch Chats");
    fireEvent.click(link);

    expect(sendMessage).toHaveBeenCalledWith(
      commandMessage("unsubscribe", chatId)
    );

    expect(sendMessage).toHaveBeenCalledWith(
      commandMessage("subscribe", chat2Id)
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

    const mess = screen.queryByText("How's it going?");
    expect(mess).toBeNull();
  });
});
