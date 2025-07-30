import axiosAuthInstance from "../axios/axiosAuthInstance";

export const updateVisibility = async (visibility) => {
  try {
    const response = await axiosAuthInstance.patch("/api/v1/visibility", { visibility });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
}
