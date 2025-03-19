import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import ChatWindow from "./ChatWindow.jsx";
import {
  authUserFixture,
  usersFixture,
} from "../../tests/fixtures/usersFixture";
import { chatsFixture } from "../../tests/fixtures/chatsFixture";
import { getChat } from "../services/chatsService";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ChannelSubscriptionContext } from "../contexts/ChannelSubscriptionContext.jsx";
import { useEffect, useState } from "react";

vi.mock("../services/chatsService");
vi.mock("../services/chatMessagesService");
vi.mock("./ChatMessages.jsx");

const mockStore = configureMockStore([]);

describe("ChatWindow Component", () => {
  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });
  const chatId = 1;
  const chat = chatsFixture.find((c) => c.id == chatId);

  let mockPresenceUpdate;

  function TestComponent() {
    const [presenceUpdate, setPresenceUpdate] = useState();

    useEffect(() => {
      mockPresenceUpdate = setPresenceUpdate;
    }, []);

    return (
      <Provider store={store}>
        <ChannelSubscriptionContext.Provider value={presenceUpdate}>
          <MemoryRouter initialEntries={[`/chats/1`]}>
            <Routes>
              <Route path="/chats/:id" element={<ChatWindow />} />
            </Routes>
          </MemoryRouter>
        </ChannelSubscriptionContext.Provider>
      </Provider>
    );
  }

  const renderComponent = () => render(<TestComponent />);

  getChat = vi.fn().mockImplementation(() => Promise.resolve(chat));

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a placeholder while loading", () => {
    renderComponent();
    const placeholder = screen.getByText("Loading...");
    expect(placeholder).toBeInTheDocument();
  });

  it("shows the name and handle of the other chat user", async () => {
    await act(() => renderComponent());
    const chat = chatsFixture.find((c) => c.id == 1);
    const otherUser = chat.users.find((u) => u.id !== authUserFixture.id);

    const otherUserFullNameElement = screen.getByText(otherUser.full_name);
    const otherUserHandleElement = screen.getByText(otherUser.handle);

    expect(otherUserFullNameElement).toBeInTheDocument();
    expect(otherUserHandleElement).toBeInTheDocument();
  });

  it("shows the presence status of the other user in the chat", async () => {
    await act(() => renderComponent());
    const presenceIndicator = screen.getByTestId("chat-presence-indicator");
    expect(presenceIndicator).toBeInTheDocument();
    expect(presenceIndicator).toHaveClass("bg-gray-500");
  });

  it("displays the last seen date and time when the other chat user is offline", async () => {
    await act(() => renderComponent());
    const presenceStatusText = screen.getByText(/Last seen/);
    expect(presenceStatusText).toBeInTheDocument();
  });

  it("sets the color of presence status indicator to green if the other user is online", async () => {
    const otherUser = {
      ...usersFixture[0],
      presence: true,
      last_seen: new Date().toISOString(),
    };
    const chatUsers = [authUserFixture, otherUser];
    const updatedChat = { ...chat, users: chatUsers };
    getChat = vi.fn().mockImplementation(() => Promise.resolve(updatedChat));
    await act(() => renderComponent());
    const presenceIndicator = screen.getByTestId("chat-presence-indicator");
  });

  it("changes the color of the presence status indicator from gray to green when the user goes online", async () => {
    const otherUser = {
      ...usersFixture[0],
      presence: false,
      last_seen: new Date().toISOString(),
    };
    const chatUsers = [authUserFixture, otherUser];
    const updatedChat = { ...chat, users: chatUsers };
    getChat = vi.fn().mockImplementation(() => Promise.resolve(updatedChat));
    await act(() => renderComponent());
    const presenceIndicator = screen.getByTestId("chat-presence-indicator");
    expect(presenceIndicator).toHaveClass("bg-gray-500");

    act(() => {
      mockPresenceUpdate({
        message: {
          id: otherUser.id,
          presence: true,
          last_seen: new Date().toISOString(),
        },
      });
    });

    expect(presenceIndicator).toHaveClass("bg-green-500");
  });

  it("displays the text 'Online' when the other chat user is online", async () => {
    const otherUser = {
      ...usersFixture[0],
      presence: true,
      last_seen: new Date().toISOString(),
    };
    const chatUsers = [authUserFixture, otherUser];
    const updatedChat = { ...chat, users: chatUsers };
    getChat = vi.fn().mockImplementation(() => Promise.resolve(updatedChat));
    await act(() => renderComponent());
    const presenceStatusText = screen.getByText(/Online/);
    expect(presenceStatusText).toBeInTheDocument();
  });
});
