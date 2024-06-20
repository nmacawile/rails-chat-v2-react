import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import ChatSelection from "./ChatSelection";
import { getChats } from "../../services/chatsService";
import { chatsFixture } from "../../../tests/fixtures/chatsFixture";
import { authUserFixture } from "../../../tests/fixtures/usersFixture";
import { BrowserRouter } from "react-router-dom";

const mockStore = configureMockStore([]);
vi.mock("../../services/chatsService");

describe("ChatSelection Component", () => {
  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChatSelection />
        </BrowserRouter>
      </Provider>
    );

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
});
