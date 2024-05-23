import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: { auth_token: null, user: null, logged_in: false },
  reducers: {
    logIn: (_, action) => {
      return { ...action.payload, logged_in: true };
    },
    logOut: () => {
      return { auth_token: null, user: null, logged_in: false };
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
