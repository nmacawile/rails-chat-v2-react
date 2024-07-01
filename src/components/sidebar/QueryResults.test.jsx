import { describe, it, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import QueryResults from "./QueryResults.jsx";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import {
  authUserFixture,
  usersFixture,
} from "../../../tests/fixtures/usersFixture";
import { queryUsers } from "../../services/queryService";

vi.mock("../../services/queryService");
const mockStore = configureMockStore([]);

describe("QueryResults Component", () => {
  let store;

  const renderComponent = () => {
    store = mockStore({
      auth: { auth_token: "token", user: authUserFixture, logged_in: true },
      sidebar: { query: "" },
    });

    render(
      <Provider store={store}>
        <QueryResults />
      </Provider>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("initially shows a placeholder while waiting for the data to load", () => {
    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the usernames and handles of the results", async () => {
    queryUsers = vi.fn().mockResolvedValue(usersFixture);

    await act(() => {
      renderComponent();
    });

    usersFixture.forEach((user) => {
      expect(screen.getByText(user.full_name)).toBeInTheDocument();
    });
  });
});
