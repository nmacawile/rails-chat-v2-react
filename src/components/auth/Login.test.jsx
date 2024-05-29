import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, act, screen } from "@testing-library/react";
import Login from "./Login.jsx";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { loginThunk } from "../../thunks/authThunks";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Login Component", () => {
  let store;

  let emailInput;
  let passwordInput;
  let loginButton;

  beforeEach(() => {
    vi.clearAllMocks();
    store = mockStore({});
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    emailInput = document.getElementById("email-input");
    passwordInput = document.getElementById("password-input");
    loginButton = document.getElementById("login-button");
  });

  it("handles the user inputs", () => {
    act(() => {
      fireEvent.change(emailInput, { target: { value: "foobar@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
    });
    expect(emailInput.value).toBe("foobar@email.com");
    expect(passwordInput.value).toBe("password");
  });

  it("submits the form", () => {
    vi.mock("../../thunks/authThunks");
    store.dispatch = vi.fn();
    loginThunk = vi.fn();

    act(() => {
      fireEvent.change(emailInput, { target: { value: "foobar@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });

    expect(store.dispatch).toHaveBeenCalled();
    expect(loginThunk).toHaveBeenCalledWith("foobar@email.com", "password");
  });

  it("displays the error message on unsuccessful login attempt", async () => {
    const mockError = new Error("Invalid credentials.");
    store.dispatch = vi.fn().mockRejectedValue(mockError);

    await act(() => {
      fireEvent.change(emailInput, { target: { value: "foobar@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });

    expect(screen.getByText("Invalid credentials.")).toBeInTheDocument();
  });

  it("blocks form submission while a request is pending", () => {
    store.dispatch = vi.fn();
    act(() => {
      fireEvent.change(emailInput, { target: { value: "foobar@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });
    expect(loginButton).toBeDisabled();
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });
});
