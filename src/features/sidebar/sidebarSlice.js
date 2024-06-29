import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: { searchMode: false, query: "" },
  reducers: {
    setSearchMode: (state, action) => ({
      ...state,
      searchMode: action.payload,
    }),
    setQuery: (state, action) => ({
      ...state,
      query: action.payload,
    }),
  },
});

export const { setSearchMode, setQuery } = sidebarSlice.actions;
export default sidebarSlice.reducer;
