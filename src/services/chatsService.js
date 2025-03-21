import axiosAuthInstance from "../axios/axiosAuthInstance";

export const getChats = async () => {
  try {
    const response = await axiosAuthInstance.get("/api/v1/chats");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getChat = async (id) => {
  try {
    const response = await axiosAuthInstance.get(`/api/v1/chats/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const findOrCreateChat = async (userId) => {
  try {
    const response = await axiosAuthInstance.post(
      `/api/v1/chats/find_or_create/${userId}`
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Service error:", errorMessage);
    throw new Error(errorMessage);
  }
};
