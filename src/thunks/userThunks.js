import { updateUser } from "../features/auth/authSlice";

import { updateVisibility } from "../services/userService";

export const updateVisibilityThunk = (visibility) => async (dispatch) => {
  try {
    const { user } = await updateVisibility(visibility);
    dispatch(updateUser(user));
  } catch (error) {
    console.error("Thunk error:", error.message);
    throw new Error(error.message);
  }
};
