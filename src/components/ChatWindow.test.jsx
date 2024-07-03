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

vi.mock("../services/chatsService");
vi.mock("../services/chatMessagesService");

const mockStore = configureMockStore([]);

describe("ChatWindow Component", () => {
  const chat = chatsFixture.find((c) => c.id === 1);
  const otherUser = chat.users.find((u) => u.id !== authUserFixture.id);
  const chatMessages = chatMessagesFixture.filter((m) => m.messageable_id === 1);

  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <ChatWindow />
      </Provider>
    );
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
    getChat = vi.fn().mockResolvedValue(chat);
    getChatMessages = vi.fn().mockResolvedValue(chatMessages);

    await act(() => renderComponent());

    const otherUserFullName = screen.getByText(otherUser.full_name);

    expect(otherUserFullName).toBeInTheDocument();
  });

  it("shows the chat messages", async () => {
    getChat = vi.fn().mockResolvedValue(chat);
    getChatMessages = vi.fn().mockResolvedValue(chatMessages);
    await act(() => renderComponent());
    chatMessages.forEach((m) => {
      const content = screen.getByText(m.content);
      expect(content).toBeInTheDocument();
    });
  });
});
