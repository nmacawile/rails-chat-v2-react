import { describe, it, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
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

  describe("loads results by batch", () => {
    let loadMoreButton;

    beforeEach(async () => {
      queryUsers = vi
        .fn()
        .mockResolvedValueOnce(usersFixture.slice(0, 20))
        .mockResolvedValueOnce(usersFixture.slice(20, 40))
        .mockResolvedValueOnce(usersFixture.slice(40, 45));

      await act(() => {
        renderComponent();
      });

      loadMoreButton = screen.getByText("Load more results");
    });

    it("loads batch 1 of 3", async () => {
      usersFixture.slice(0, 20).forEach((user) => {
        expect(screen.getByText(user.full_name)).toBeInTheDocument();
      });

      expect(loadMoreButton).toBeInTheDocument();
    });

    it("loads batch 2 of 3", async () => {
      await act(() => {
        fireEvent.click(loadMoreButton);
      });

      usersFixture.slice(0, 40).forEach((user) => {
        expect(screen.getByText(user.full_name)).toBeInTheDocument();
      });

      expect(loadMoreButton).toBeInTheDocument();
    });

    it("loads batch 3 of 3", async () => {
      await act(() => {
        fireEvent.click(loadMoreButton);
        fireEvent.click(loadMoreButton);
      });

      usersFixture.slice(40, 45).forEach((user) => {
        expect(screen.getByText(user.full_name)).toBeInTheDocument();
      });

      expect(loadMoreButton).not.toBeInTheDocument();
    });
  });
});
