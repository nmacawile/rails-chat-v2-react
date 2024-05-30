import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Auth from "./Auth.jsx";
import configureMockStore from "redux-mock-store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

const mockStore = configureMockStore([]);

const renderWithCustomStore = (store) => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/auth/login"]}>
        <Routes>
          <Route path="/" element={<h1>Welcome</h1>} />
          <Route path="/auth" element={<Auth />}>
            <Route path="login" element={<h1>Login Page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("Auth Component", () => {
  it("redirects to Home page when authenticated", () => {
    const store = mockStore({ auth: { logged_in: true } });
    renderWithCustomStore(store);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("remains on the page when unauthenticated", () => {
    const store = mockStore({ auth: { logged_in: false } });
    renderWithCustomStore(store);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
