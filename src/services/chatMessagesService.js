import axiosAuthInstance from "../axios/axiosAuthInstance";

export const getChatMessages = async (id, beforeId = null) => {
  let url = `/api/v1/chats/${id}/messages`;
  if (beforeId) url += `?before=${beforeId}`;
  try {
    const response = await axiosAuthInstance.get(url);
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
