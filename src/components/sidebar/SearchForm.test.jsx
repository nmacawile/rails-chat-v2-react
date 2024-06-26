import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
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

  it("exits search mode and clears the search query when the back button is clicked", () => {
    renderComponent(true);
    const backButton = document.getElementById("search-back-button");
    fireEvent.click(backButton);
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
