import apiClient from "./apiClient";

export const getAllGames = async () => {
  const response = await apiClient.get("/director/req");
  return response.data;
}