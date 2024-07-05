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

export const postChatMessage = async (chatId, content) => {
  try {
    const response = await axiosAuthInstance.post(
      `/api/v1/chats/${chatId}/messages`,
      {
        message: { content },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
