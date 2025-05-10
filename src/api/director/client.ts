// src/api/director/client.ts
import { apiClient } from "@/api/apiClients";
import { PlayerListType } from "@/types/lanes";

export const getPlayStatus = async () => {
  const response = await apiClient.get("/director/play_num");
  return response.data as {
    code: number;
    data: {
      play_num: number;
      player_list: PlayerListType[];
    }[];
  };
};
