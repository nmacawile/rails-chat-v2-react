import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { loadState } from "../storage/localStorage";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});
