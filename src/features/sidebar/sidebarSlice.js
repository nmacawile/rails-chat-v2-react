import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: { searchMode: false },
  reducers: {
    setSearchMode: (state, action) => ({
      ...state,
      searchMode: action.payload,
    }),
  },
});

export const { setSearchMode } = sidebarSlice.actions;
export default sidebarSlice.reducer;
