import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { authUserFixture } from "../../../tests/fixtures/usersFixture";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserInfoPanel from "./UserInfoPanel.jsx";

import { thunk } from "redux-thunk";
import { updateVisibilityThunk } from "../../thunks/userThunks.js";
import { useActionState } from "react";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("UserInfoPanelComponent", () => {
  const store = mockStore({ auth: { user: authUserFixture } });

  const renderComponent = (testStore = store) => {
    render(
      <Provider store={testStore}>
        <UserInfoPanel />
      </Provider>
    );
  };

  it("shows the auth user's full name", () => {
    renderComponent();
    expect(screen.getByText(authUserFixture.full_name)).toBeInTheDocument();
  });

  describe("visibility toggle", () => {
    let visibilityToggle;

    it("is in the document", () => {
      renderComponent();
      visibilityToggle = screen.getByTestId("visibility-toggle");
      expect(visibilityToggle).toBeInTheDocument();
    });

    it("sends visibility update request when clicked", async () => {
      store.dispatch = vi.fn();
      vi.mock("../../thunks/userThunks.js");
      updateVisibilityThunk = vi.fn(() => () => Promise.resolve());

      renderComponent();
      visibilityToggle = screen.getByTestId("visibility-toggle");
      await waitFor(async () => {
        await expect(screen.getByText("Available")).toBeInTheDocument();
      });

      fireEvent.click(visibilityToggle);

      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalled();
      });

      expect(updateVisibilityThunk).toHaveBeenCalledWith(false);
    });
  });
});
