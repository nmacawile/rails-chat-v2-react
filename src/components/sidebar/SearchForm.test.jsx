import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import SearchForm from "./SearchForm.jsx";

describe("SearchForm Component", () => {
  const setSearchMode = vi.fn();
  const renderComponent = (searchMode = false) =>
    render(
      <SearchForm searchMode={searchMode} setSearchMode={setSearchMode} />
    );

  it("does not show the back button initially", () => {
    renderComponent();
    const backButton = document.getElementById("search-back-button");
    expect(backButton).not.toBeInTheDocument();
  });

  it("goes into search mode when the search input is focused on", () => {
    renderComponent();
    const searchInput = document.getElementById("search-input");
    fireEvent.focus(searchInput)
    expect(setSearchMode).toHaveBeenCalledWith(true);
  });

  it("exits search mode when the back button is clicked", () => {
    renderComponent(true);
    const backButton = document.getElementById("search-back-button");
    fireEvent.click(backButton);
    expect(setSearchMode).toHaveBeenCalledWith(false);
  });

  it("clears the search query when back button is clicked", async () => {
    renderComponent(true);
    const backButton = document.getElementById("search-back-button");
    const searchInput = document.getElementById("search-input");
    fireEvent.change(searchInput, { target: { value: "Hi" } });
    fireEvent.click(backButton);
    expect(setSearchMode).toHaveBeenCalledWith(false);
    expect(searchInput.value).toBe("");
  });
});
