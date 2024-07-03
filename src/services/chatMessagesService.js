import axiosAuthInstance from "../axios/axiosAuthInstance";

export const getChatMessages = async (id) => {
  try {
    const response = await axiosAuthInstance.get(
      `/api/v1/chats/${id}/messages`
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
