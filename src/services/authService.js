import axiosUnauthInstance from "../axios/axiosUnauthInstance";

export const authenticate = async (email, password) => {
  try {
    const response = await axiosUnauthInstance.post("/api/v1/auth/login", {
      email,
      password,
    });
    const { auth_token, user, exp } = response.data;
    return { auth_token, user, exp };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
