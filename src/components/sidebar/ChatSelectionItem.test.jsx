import { describe, expect, it } from "vitest";
import ChatSelectionItem from "./ChatSelectionItem.jsx";
import configureMockStore from "redux-mock-store";
import { render, screen, act } from "@testing-library/react";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { ChannelSubscriptionContext } from "../../contexts/ChannelSubscriptionContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import {
  authUserFixture,
  usersFixture,
} from "../../../tests/fixtures/usersFixture";

import { chatsFixture } from "../../../tests/fixtures/chatsFixture";

const mockStore = configureMockStore([]);

describe("ChatSelectionItem Component", () => {
  const otherUser = usersFixture[0];
  const authUser = authUserFixture;
  const defaultChat = { ...chatsFixture[0], users: [authUser, otherUser] };

  const store = mockStore({
    auth: {
      user: authUserFixture,
    },
  });

  let mockPresenceUpdate;

  function TestComponent(props) {
    const [chat, setChat] = useState(props.chat);
    const [presenceUpdate, setPresenceUpdate] = useState();

    useEffect(() => {
      mockPresenceUpdate = setPresenceUpdate;
    }, []);

    return (
      <Provider store={store}>
        <ChannelSubscriptionContext.Provider value={presenceUpdate}>
          <MemoryRouter initialEntries={[`/`]}>
            <Routes>
              <Route
                path="/"
                element={<ChatSelectionItem chat={chat} updateChat={setChat} />}
              />
            </Routes>
          </MemoryRouter>
        </ChannelSubscriptionContext.Provider>
      </Provider>
    );
  }

  function renderComponent(chat) {
    render(<TestComponent chat={chat} />);
  }

  it("shows the status indicator of the other user in the chat", () => {
    renderComponent(defaultChat);
    const presenceIndicator = screen.getByTestId("presence-indicator");
    expect(presenceIndicator).toBeInTheDocument();
  });

  it("sets the status indicator as gray when the other user is not online", () => {
    const chatUsers = [authUser, { ...otherUser, presence: false }];
    const chat = { ...defaultChat, users: chatUsers };
    renderComponent(chat);
    const presenceIndicator = screen.getByTestId("presence-indicator");
    expect(presenceIndicator).toHaveClass("bg-gray-500");
  });

  it("sets the status indicator as green when the other user is online", () => {
    const chatUsers = [authUser, { ...otherUser, presence: true }];
    const chat = { ...defaultChat, users: chatUsers };
    renderComponent(chat);
    const presenceIndicator = screen.getByTestId("presence-indicator");
    expect(presenceIndicator).toHaveClass("bg-green-500");
  });

  it("changes color from gray to green when other user goes online", () => {
    const chatUsers = [authUser, { ...otherUser, presence: false }];
    const chat = { ...defaultChat, users: chatUsers };
    renderComponent(chat);
    const presenceIndicator = screen.getByTestId("presence-indicator");
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
});
