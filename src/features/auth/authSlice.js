import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: { auth_token: null, user: null, logged_in: false },
  reducers: {
    logIn: (state, action) => {
      const { auth_token, user } = action.payload;
      state.auth_token = auth_token;
      state.user = user;
      state.logged_in = true;
    },
    logOut: (state) => {
      state.auth_token = null;
      state.user = null;
      state.logged_in = false;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
