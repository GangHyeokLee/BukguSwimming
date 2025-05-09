// src/api/director/client.ts
import { apiClient } from "@/api/apiClients";

export const getPlayStatus = async () => {
  const response = await apiClient.get("/director/play_num");
  return response.data;
};
