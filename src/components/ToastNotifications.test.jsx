import { useState, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import { ToastNotifications } from "./ToastNotifications.jsx";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  authUserFixture,
  usersFixture,
} from "../../tests/fixtures/usersFixture";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { SharedChannelSubscriptionsContext } from "../contexts/SharedChannelSubscriptionsContext.jsx";

function createChatNotification(
  chatId,
  sender,
  receiver,
  message,
  _users = []
) {
  const users = _users.length < 2 ? [sender, receiver] : _users;
  return {
    identifier: `{"channel":"NotificationsChannel","user_id":${sender.id}}`,
    message: {
      chat: {
        id: chatId,
        type: "Chat",
        users,
        latest_message: {
          content: message,
          user: sender,
        },
      },
    },
  };
}

describe("ToastNotificationsComponent", () => {
  const mockStore = configureMockStore([]);
  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  let mockNotification;

  function TestComponent() {
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
      mockNotification = setNotifications;
      return () => {
        mockNotification = null;
      };
    }, []);

    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/chats/1`]}>
          <SharedChannelSubscriptionsContext.Provider value={{ notifications }}>
            <Routes>
              <Route path="/chats/:id" element={<ToastNotifications />} />
            </Routes>
          </SharedChannelSubscriptionsContext.Provider>
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
    render(<TestComponent />);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("is not in the document", () => {
      const message = "What's Up?";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });
  });

  describe("flashing notification", () => {
    const { visibility, email, ...receiver } = authUserFixture;
    const sender = usersFixture[0];
    const chatId = 5;
    const message = "What's Up?";
    const chatNotificationData = createChatNotification(
      chatId,
      sender,
      receiver,
      message
    );

    beforeEach(() => {
      act(() => mockNotification(chatNotificationData));
    });

    it("flashes briefly after receiving a notification", async () => {
      await screen.findByText(message);
      vi.runOnlyPendingTimers();
      await waitForElementToBeRemoved(() => screen.queryByText(message));
    });

    it("closes after clicking the close button", async () => {
      const closeButton = screen.getByTestId(
        `chat-${chatId}-notification-close-button`
      );
      await screen.findByText(message);
      act(() => {
        fireEvent.click(closeButton);
      });
      await waitForElementToBeRemoved(() => screen.queryByText(message));
    });

    it("closes the notification after clicking the chat link", async () => {
      const chatLink = screen.getByTestId(`chat-${chatId}-link`);
      act(() => {
        fireEvent.click(chatLink);
      });
      await waitForElementToBeRemoved(() => screen.queryByText(message));
    });

    it("contains all the necessary information", () => {
      const senderName = sender.full_name;
      const senderHandle = sender.handle;
      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.getByText(senderName)).toBeInTheDocument();
      expect(screen.getByText(senderHandle)).toBeInTheDocument();
    });

    it("has a link to the chat page", () => {
      const chatLink = screen.getByTestId(`chat-${chatId}-link`);
      expect(chatLink).toHaveAttribute("href", `/chats/${chatId}`);
    });
  });

  describe("multiple flashing notifications for different chat ids", () => {
    const { visibility, email, ...receiver } = authUserFixture;
    const sender1 = usersFixture[0];
    const sender2 = usersFixture[1];
    const chatId1 = 5;
    const chatId2 = 6;
    const message1 = "What's Up?";
    const message2 = "Howdy?";

    const chatNotificationData1 = createChatNotification(
      chatId1,
      sender1,
      receiver,
      message1
    );

    const chatNotificationData2 = createChatNotification(
      chatId2,
      sender2,
      receiver,
      message2
    );

    beforeEach(() => {
      act(() => mockNotification(chatNotificationData1));
      act(() => mockNotification(chatNotificationData2));
    });

    it("flash briefly after receiving the notifications", async () => {
      expect(screen.getByText(message1)).toBeInTheDocument();
      expect(screen.getByText(message2)).toBeInTheDocument();
      vi.runOnlyPendingTimers();
      await Promise.all([
        waitForElementToBeRemoved(() => screen.queryByText(message1)),
        waitForElementToBeRemoved(() => screen.queryByText(message2)),
      ]);
    });
  });

  describe("multiple flashing notifications for the same chat id", () => {
    const { visibility, email, ...receiver } = authUserFixture;
    const sender = usersFixture[0];
    const chatId = 5;
    const message1 = "What's Up?";
    const message2 = "Howdy?";
    const chatNotificationData1 = createChatNotification(
      chatId,
      sender,
      receiver,
      message1
    );

    const chatNotificationData2 = createChatNotification(
      chatId,
      sender,
      receiver,
      message2
    );

    beforeEach(() => {
      act(() => mockNotification(chatNotificationData1));
      act(() => mockNotification(chatNotificationData2));
    });

    it("flashes only the latest notification briefly after receiving the notifications", async () => {
      expect(screen.queryByText(message1)).not.toBeInTheDocument();
      expect(screen.getByText(message2)).toBeInTheDocument();
      vi.runOnlyPendingTimers();
      await waitForElementToBeRemoved(() => screen.queryByText(message2));
    });
  });

  describe("when user is in the same chat page as the notification data", () => {
    const { visibility, email, ...receiver } = authUserFixture;
    const sender = usersFixture[0];
    const chatId = 1;
    const message = "What's Up?";
    const chatNotificationData = createChatNotification(
      chatId,
      sender,
      receiver,
      message
    );

    it("doesn't appear", () => {
      const senderName = sender.full_name;
      expect(screen.queryByText(senderName)).not.toBeInTheDocument();
      act(() => mockNotification(chatNotificationData));
      expect(screen.queryByText(senderName)).not.toBeInTheDocument();
    });
  });

  describe("when user is the message sender", () => {
    const { visibility, email, ...receiver } = authUserFixture;
    const sender = receiver;
    const otherUser = usersFixture[0];
    const chatId = 5;
    const message = "What's Up?";
    const chatNotificationData = createChatNotification(
      chatId,
      sender,
      receiver,
      message,
      [sender, otherUser]
    );

    it("doesn't appear", () => {
      const senderName = sender.full_name;
      expect(screen.queryByText(senderName)).not.toBeInTheDocument();
      act(() => mockNotification(chatNotificationData));
      expect(screen.queryByText(senderName)).not.toBeInTheDocument();
    });
  });
});
