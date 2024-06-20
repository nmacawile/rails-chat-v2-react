import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { authUserFixture } from "../../../tests/fixtures/usersFixture";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserInfoPanel from "./UserInfoPanel.jsx";

const mockStore = configureMockStore([]);

describe("UserInfoPanelComponent", () => {
  const store = mockStore({ auth: { user: authUserFixture } });

  beforeEach(() => {
    render(
      <Provider store={store}>
        <UserInfoPanel />
      </Provider>
    );
  });

  it("shows the auth user's full name", () => {
    expect(screen.getByText(authUserFixture.full_name)).toBeInTheDocument();
  });
});
