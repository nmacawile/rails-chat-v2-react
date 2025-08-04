import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import ChatSelection from "./ChatSelection";
import { getChats } from "../../services/chatsService";
import { chatsFixture } from "../../../tests/fixtures/chatsFixture";
import {
  authUserFixture,
  usersFixture,
} from "../../../tests/fixtures/usersFixture";
import { BrowserRouter } from "react-router-dom";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useEffect, useState } from "react";
import { SharedChannelSubscriptionsContext } from "../../contexts/SharedChannelSubscriptionsContext";

const mockStore = configureMockStore([]);
vi.mock("../../services/chatsService");

describe("ChatSelection Component", () => {
  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  const commandMessage = (command, id) =>
    JSON.stringify({
      command: command,
      identifier: JSON.stringify({
        channel: "NotificationsChannel",
        user_id: id,
      }),
    });

  let changeMessage = vi.fn();
  let sendMessage = vi.fn();

  const TestComponent = () => {
    const [lastMessage, setLastMessage] = useState(null);
    const presenceUpdates = null;
    const readyState = 1; // OPEN

    useEffect(() => {
      changeMessage = setLastMessage;
      return () => {
        changeMessage = null;
      };
    }, []);

    return (
      <Provider store={store}>
        <BrowserRouter>
          <WebSocketContext.Provider
            value={{ lastMessage, readyState, sendMessage }}
          >
            <SharedChannelSubscriptionsContext.Provider
              value={{ presenceUpdates }}
            >
              <ChatSelection />
            </SharedChannelSubscriptionsContext.Provider>
          </WebSocketContext.Provider>
        </BrowserRouter>
      </Provider>
    );
  };

  const renderComponent = () => render(<TestComponent />);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("lists all chats joined by the user", async () => {
    getChats = vi.fn().mockResolvedValue(chatsFixture);
    await act(() => {
      renderComponent();
    });

    await waitFor(() => {
      expect(getChats).toHaveBeenCalled();
    });

    chatsFixture.forEach((chat) => {
      expect(screen.getByText(chat.latest_message.content)).toBeInTheDocument();

      chat.users
        .filter((chatUser) => chatUser.id !== authUserFixture.id)
        .forEach((chatUser) => {
          expect(screen.getByText(chatUser.full_name)).toBeInTheDocument();
        });
    });
  });

  it("has links to all the chats", async () => {
    getChats = vi.fn().mockResolvedValue(chatsFixture);
    await act(() => {
      renderComponent();
    });

    await waitFor(() => {
      expect(getChats).toHaveBeenCalled();
    });

    chatsFixture.forEach((chat) => {
      const testId = `chat-${chat.id}-link`;
      const link = screen.getByTestId(testId);
      expect(link).toHaveAttribute("href", `/chats/${chat.id}`);
    });
  });

  it("shows a placeholder while loading chats", async () => {
    getChats = vi.fn().mockResolvedValue(chatsFixture);
    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("stops showing placeholder after an error loading chats", async () => {
    getChats = vi.fn().mockRejectedValue(new Error("Request Error."));

    await act(() => {
      renderComponent();
    });

    await waitFor(() => {
      expect(getChats).toHaveBeenCalled();
    });

    const placeholder = screen.queryByText("Loading...");

    expect(placeholder).not.toBeInTheDocument();
  });

  it("subscribes to the Notifications channel on mount", async () => {
    await act(() => renderComponent());

    expect(sendMessage).toHaveBeenCalledWith(commandMessage("subscribe", 999));
  });

  it("updates the chat item that received a message", async () => {
    getChats = vi.fn().mockResolvedValue(chatsFixture);
    await act(() => renderComponent());

    const user2 = usersFixture[0];
    const chat = { ...chatsFixture[0] };
    chat.latest_message = { content: "How is it going?", user: user2 };

    act(() => {
      changeMessage({
        data: JSON.stringify({
          identifier: JSON.stringify({
            channel: "NotificationsChannel",
            user_id: 999,
          }),
          message: { chat },
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText("How is it going?")).toBeInTheDocument();
    });
  });

  it("appends the chat item when a new chat receives a message", async () => {
    getChats = vi.fn().mockResolvedValue(chatsFixture);
    await act(() => renderComponent());

    const unknownUser = usersFixture[44];
    const chat = { ...chatsFixture[0] };
    chat.latest_message = { content: "How is it going?", user: unknownUser };
    chat.id = 99;

    act(() => {
      changeMessage({
        data: JSON.stringify({
          identifier: JSON.stringify({
            channel: "NotificationsChannel",
            user_id: 999,
          }),
          message: { chat },
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText("How is it going?")).toBeInTheDocument();
    });
  });
});
