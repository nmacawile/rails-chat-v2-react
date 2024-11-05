import axiosAuthInstance from "../axios/axiosAuthInstance";

export const queryUsers = async (q = "", { per_page = 20, page = 1 } = {}) => {
  try {
    const response = await axiosAuthInstance.get("/api/v1/users", {
      params: { q, page, per_page },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
