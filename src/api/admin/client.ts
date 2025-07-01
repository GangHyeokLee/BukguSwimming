import { apiClient } from '@/api/apiClients';
import { CertificateResponse } from "@/types/cert";
import { PlayerListType } from "@/types/lanes";

export const printCertificate = async (play_data_id: number, swimming_id: number) => {
  const response = await apiClient.post("/admin/print_prize", { play_data_id: play_data_id, swimming_id: swimming_id });
  return response.data as CertificateResponse
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