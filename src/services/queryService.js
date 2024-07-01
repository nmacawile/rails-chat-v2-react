import axiosAuthInstance from "../axios/axiosAuthInstance";

export const queryUsers = async (query = "") => {
  try {
    const response = await axiosAuthInstance.get("/api/v1/users", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
