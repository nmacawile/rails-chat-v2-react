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
    updateUser: (state, action) => {
      return { ...state, user: action.payload };
    }
  },
});

export const { logIn, logOut, updateUser } = authSlice.actions;
export default authSlice.reducer;
