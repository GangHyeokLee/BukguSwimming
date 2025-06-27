import { apiClient } from '@/api/apiClients';
import { PlayerListType } from "@/types/lanes";

export const printCertificate = async (id: number) => {
  const response = await apiClient.post("/admin/print_prize", { id: id });
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

export const reloadPlayStatus = async (swimming_id: number) => {
  const response = await apiClient.post("/admin/swimming", { id: swimming_id });
  return response.data as {
    code: number;
    data: {
      swimming_id: number;
      player_list: PlayerListType[];
    }[];
  };
};

export const updatePlayRecord = async (swimming_id: number, id: number, record: number, dq: string) => {
  const response = await apiClient.post("/admin/record_modify", {
    id: id,
    swimming_id: swimming_id,
    record: record,
    dq: dq
  });
  return response.status === 200 ? true : false;
}