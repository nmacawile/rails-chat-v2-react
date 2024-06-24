import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import { loadState } from "../storage/localStorage";

export default configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
  preloadedState: loadState(),
});
