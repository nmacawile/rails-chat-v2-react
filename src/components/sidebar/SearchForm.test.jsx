import { describe, it, expect } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SearchForm from "./SearchForm.jsx";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore([]);

describe("SearchForm Component", () => {
  let store;

  const getLatestAction = (n) => store.getActions().pop();

  const renderComponent = (searchMode = false) => {
    store = mockStore({ sidebar: { searchMode, query: "" } });
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
  };

  it("does not show the back button initially", () => {
    renderComponent();
    const backButton = document.getElementById("search-back-button");
    expect(backButton).not.toBeInTheDocument();
  });

  it("goes into search mode when the search input is focused on", () => {
    renderComponent();
    const searchInput = document.getElementById("search-input");
    fireEvent.focus(searchInput);
    expect(getLatestAction()).toEqual({
      type: "sidebar/setSearchMode",
      payload: true,
    });
  });

  it("exits search mode and clears the search query when the back button is clicked", async () => {
    renderComponent(true);
    const backButton = document.getElementById("search-back-button");
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(store.getActions().slice(-2)).toEqual([
        {
          type: "sidebar/setSearchMode",
          payload: false,
        },
        {
          type: "sidebar/setQuery",
          payload: "",
        },
      ]);
    });
  });

  it("automatically updates the query value when changing the input field value", async () => {
    renderComponent(true);
    const searchInput = document.getElementById("search-input");
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: "new query" } });
    await waitFor(() => {
      expect(getLatestAction()).toEqual({
        type: "sidebar/setQuery",
        payload: "new query",
      });
    });
  });

  it("blocks form submission", () => {
    renderComponent(true);
    const searchForm = document.getElementById("search-form");
    expect(searchForm).toBeInTheDocument();

    const submitEvent = new Event("submit", {
      bubbles: true,
      cancellable: true,
    });
    const preventDefault = vi.fn();
    submitEvent.preventDefault = preventDefault;

    searchForm.dispatchEvent(submitEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("initially does not show the input clear button", () => {
    renderComponent(true);
    const searchInputClearButton = document.getElementById(
      "search-input-clear-button"
    );
    expect(searchInputClearButton).not.toBeInTheDocument();
  });

  it("shows the input clear button when the it is not empty", () => {
    renderComponent(true);
    const searchInput = document.getElementById("search-input");
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: "new query" } });
    const searchInputClearButton = document.getElementById(
      "search-input-clear-button"
    );
    expect(searchInputClearButton).toBeInTheDocument();
  });
});
