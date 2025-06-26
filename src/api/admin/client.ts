import { apiClient } from '@/api/apiClients';
import { PlayerListType } from "@/types/lanes";

export const getTeamScores = async () => {
  const response = await apiClient.get("/admin/team_scores");
  return response.data as {
    count: number;
    data: {
      team: string;
      total_score: number;
    }[];
    status: string;
  }
}

export const printCertificate = async (id: number) => {
  const response = await apiClient.post("/admin/print_prize", {id: id});
  return response.data as {
    cert_data: {
      cert_data: string;
      cert_name: string;
      cert_num: number;
      president: string;
      stamp_img: string;
    },
    code: number;
    swimming_data: {
      dq: string;
      id: number;
      lane: number;
      play_num: number;
      player: string;
      rank: number;
      record: number;
      srore_id: string;
      score_rank?: number;
      score_value?: number;
      swimming_name: string;
      team: string;
    }
  }
}

export const getPlayStatus = async () => {
  const response = await apiClient.get("/admin/swimming");
  return response.data as {
    code: number;
    data: {
      swimming_id: number;
      player_list: PlayerListType[];
    }[];
  };
};
