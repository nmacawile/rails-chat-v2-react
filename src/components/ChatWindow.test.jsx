import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import ChatWindow from "./ChatWindow.jsx";
import { authUserFixture } from "../../tests/fixtures/usersFixture";
import { chatsFixture } from "../../tests/fixtures/chatsFixture";
import { chatMessagesFixture } from "../../tests/fixtures/chatMessagesFixture";
import { getChat } from "../services/chatsService";
import { getChatMessages } from "../services/chatMessagesService";
import { ChatMessages } from "./ChatMessages.jsx";
import { MemoryRouter, Routes, Route } from "react-router-dom";

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

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/chats/1`]}>
          <Routes>
            <Route path="/chats/:id" element={<ChatWindow />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

  getChat = vi.fn().mockImplementation(() => {
    const chat = chatsFixture.find((c) => c.id == 1);
    return Promise.resolve(chat);
  });

  getChatMessages = vi.fn().mockImplementation(() => {
    const chatMessages = chatMessagesFixture.filter(
      (m) => m.messageable_id == 1
    );
    return Promise.resolve(chatMessages);
  });

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
});
