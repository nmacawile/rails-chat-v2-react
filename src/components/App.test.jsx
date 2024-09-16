import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App.jsx";
import configureMockStore from "redux-mock-store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { authUserFixture } from "../../tests/fixtures/usersFixture";
import { thunk } from "redux-thunk";
import { logoutThunk } from "../thunks/authThunks";
import { act } from "react-dom/test-utils";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../thunks/authThunks");

const renderWithCustomStore = (store) => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<h1>Welcome</h1>} />
          </Route>
          <Route path="/auth/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const expiredTimestamp = new Date("1 October 2024").getTime() / 1000;
const validTimestamp = new Date("1 January 2025").getTime() / 1000;

const auth = { user: authUserFixture, logged_in: true, exp: validTimestamp };

describe("App Component", () => {
  it("redirects to Login page when unauthenticated", () => {
    const store = mockStore({ auth: { ...auth, logged_in: false } });
    store.dispatch = vi.fn();
    renderWithCustomStore(store);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("Logs out and redirects user to Login page when token expires", () => {
    const store = mockStore({
      auth: { ...auth, exp: expiredTimestamp },
    });
    logoutThunk = vi.fn();
    store.dispatch = vi.fn();

    const mockDate = new Date("1 December 2024").getTime();
    vi.spyOn(Date, "now").mockImplementation(() => mockDate);

    act(() => renderWithCustomStore(store));

    expect(store.dispatch).toHaveBeenCalled();
    expect(logoutThunk).toHaveBeenCalled();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("remains on the page when authenticated", () => {
    const store = mockStore({ auth });
    renderWithCustomStore(store);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });
});
