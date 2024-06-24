import { describe } from "vitest";
import sidebarSlice, { setSearchMode } from "./sidebarSlice";

describe("sidebarSlice", () => {
  describe("sidebar reducer", () => {
    it("changes the state of searchMode", () => {
      const newState = sidebarSlice({ searchMode: false }, setSearchMode(true));
      expect(newState).toEqual({ searchMode: true });
    });
  });
});
