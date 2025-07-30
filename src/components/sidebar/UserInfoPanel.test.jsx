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

    it("disables the control right after a click", () => {
      renderComponent();
      visibilityToggle = screen.getByTestId("visibility-toggle");
      fireEvent.click(visibilityToggle);
      waitFor(() => expect(visibilityToggle).toBeDisabled());
    });

    describe("User is visible", () => {
      it("sends visibility update request with a value of 'false' when clicked", async () => {
        renderComponent();
        visibilityToggle = screen.getByTestId("visibility-toggle");
        vi.mock("../../thunks/userThunks.js");
        store.dispatch = vi.fn();
        updateVisibilityThunk = vi.fn();

        await act(() => {
          fireEvent.click(visibilityToggle);
        });

        waitFor(() => {
          expect(store.dispatch).toHaveBeenCalled();
        });

        expect(updateVisibilityThunk).toHaveBeenCalledWith(false);
      });
    });

    describe("User is invisible", () => {
      it("sends visibility update request with a value of 'true' when clicked", async () => {
        const testStore = mockStore({
          auth: { user: { ...authUserFixture, visibility: false } },
        });
        renderComponent(testStore);
        visibilityToggle = screen.getByTestId("visibility-toggle");
        vi.mock("../../thunks/userThunks.js");
        store.dispatch = vi.fn();
        updateVisibilityThunk = vi.fn();

        await act(() => {
          fireEvent.click(visibilityToggle);
        });

        waitFor(() => {
          expect(store.dispatch).toHaveBeenCalled();
        });

        expect(updateVisibilityThunk).toHaveBeenCalledWith(true);
      });
    });
  });
});
