import { createSlice } from "@reduxjs/toolkit";

const noAuth = { auth_token: null, user: null, exp: null, logged_in: false };

export const authSlice = createSlice({
  name: "auth",
  initialState: { ...noAuth },
  reducers: {
    logIn: (_, action) => {
      return { ...action.payload, logged_in: true };
    },
    logOut: () => {
      return { ...noAuth };
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
