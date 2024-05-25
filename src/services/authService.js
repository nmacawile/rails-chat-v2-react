import axiosInstance from "../axios/axiosInstance";

export const authenticate = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
      password,
    });
    const { auth_token, user } = response.data;
    return { auth_token, user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};