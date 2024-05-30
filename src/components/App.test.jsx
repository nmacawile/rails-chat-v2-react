import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.jsx";
import configureMockStore from "redux-mock-store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

const mockStore = configureMockStore([]);

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

describe("App Component", () => {
  it("redirects to Login page when unauthenticated", () => {
    const store = mockStore({ auth: { logged_in: false } });
    renderWithCustomStore(store);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("remains on the page when authenticated", () => {
    const store = mockStore({ auth: { logged_in: true } });
    renderWithCustomStore(store);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });
});
