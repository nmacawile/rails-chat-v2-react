import { configureStore } from "@reduxjx/toolkit";
import authReducer from "../features/auth/authSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
