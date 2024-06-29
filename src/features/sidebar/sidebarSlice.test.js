import { describe } from "vitest";
import sidebarSlice, { setQuery, setSearchMode } from "./sidebarSlice";

describe("sidebarSlice", () => {
  describe("sidebar reducer", () => {
    it("changes the state of searchMode", () => {
      const newState = sidebarSlice(
        { searchMode: false, query: "" },
        setSearchMode(true)
      );
      expect(newState).toEqual({ searchMode: true, query: "" });
    });

    it("changes the state of query", () => {
      const newState = sidebarSlice(
        { searchMode: true, query: "" },
        setQuery("test")
      );
      expect(newState).toEqual({ searchMode: true, query: "test" });
    });
  });
});
