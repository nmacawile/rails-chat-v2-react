import { describe, it, expect, vi, beforeAll } from "vitest";
import {
  screen,
  act,
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { ChatMessages } from "./ChatMessages.jsx";
import { authUserFixture } from "../../tests/fixtures/usersFixture";
import { chatMessagesFixture } from "../../tests/fixtures/chatMessagesFixture";
import { getChatMessages } from "../services/chatMessagesService";
import { WebSocketContext } from "../contexts/WebSocketContext.jsx";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

  beforeEach(() => {
    getChatMessages = vi.fn().mockImplementation((id) => {
      const chatMessages = fetchChatMessages(id);
      return Promise.resolve(chatMessages);
    });
  });

  const TestComponent = ({ chatId }) => {
    const [lastMessage, setLastMessage] = useState(null);
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
                  <ChatMessages id={chatId} />
                </WebSocketContext.Provider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  const renderComponent = (chatId) => render(<TestComponent chatId={chatId} />);

  it("shows the chat messages", async () => {
    await act(() => renderComponent(chatId));
    const chatMessages = fetchChatMessages(chatId);
    chatMessages.forEach((m) => {
      const content = screen.getByText(m.content);
      expect(content).toBeInTheDocument();
    });
  });

  describe("loading old chat messages", () => {
    const chatId = "3";
    const allChatMessages = fetchChatMessages(chatId).reverse();
    const firstBatch = allChatMessages.splice(0, 20);
    const secondBatch = allChatMessages.splice(21, 40);
    let loadMoreButton;

    beforeEach(async () => {
      getChatMessages = vi
        .fn()
        .mockResolvedValueOnce(firstBatch)
        .mockResolvedValueOnce(secondBatch);

      await act(() => renderComponent(chatId));
      await waitFor(() => {
        loadMoreButton = screen.getByText("Load older messages");
        expect(loadMoreButton).toBeInTheDocument();
      });
    });

    it("initially doesn't render the older chat messages", () => {
      firstBatch.forEach((m) => {
        const content = screen.getByText(m.content);
        expect(content).toBeInTheDocument();
      });

      secondBatch.forEach((m) => {
        const content = screen.getByText(m.content);
        expect(content).not.toBeInTheDocument();
      });
    });

    it(
      "renders the older chat messages after " +
        "clicking the 'Load more messages' button",
      async () => {
        fireEvent.click(loadMoreButton);

        secondBatch.forEach((m) => {
          const content = screen.getByText(m.content);
          expect(content).toBeInTheDocument();
        });
      }
    );

    it(
      "hides the 'Load more messages' button if the number of " +
        "results of the last request is smaller than the set page size",
      async () => {
        fireEvent.click(loadMoreButton);

        await waitFor(() => {
          expect(loadMoreButton).not.toBeInTheDocument();
        });
      }
    );
  });

  it("subscribes to the Chat channel on mount", async () => {
    await act(() => renderComponent(chatId));

    expect(sendMessage).toHaveBeenCalledWith(
      commandMessage("subscribe", chatId)
    );
  });

  it("displays the received chat message", async () => {
    await act(() => renderComponent(chatId));
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
    await act(() => renderComponent(chatId));

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
