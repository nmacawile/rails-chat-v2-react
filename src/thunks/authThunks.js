import { authenticate } from "../services/authService";

import {
  logIn as loginReducer,
  logOut as logoutReducer,
} from "../features/auth/authSlice";

export const loginThunk = (email, password) => async (dispatch) => {
  try {
    const { user, auth_token, exp } = await authenticate(email, password);
    dispatch(loginReducer({ user, auth_token, exp }));
  } catch (error) {
    console.error("Thunk error:", error.message);
    throw new Error(error.message);
  }
};

export const logoutThunk = () => (dispatch) => {
  dispatch(logoutReducer());
};
