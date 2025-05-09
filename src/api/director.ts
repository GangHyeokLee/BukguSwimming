import { apiClient } from '@/api/apiClients';

export const getAllGames = async () => {
  const response = await apiClient.get("/director/req");
  return response.data;
}