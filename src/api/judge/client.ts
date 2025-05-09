import { apiClient } from "@/api/apiClients";

export const getLanes = async (lane_num: number) => {
  try {
    const response = await apiClient.get(`/judge/all_req?lane_num=${lane_num}`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching lanes:", error);
    throw error;
  }
}


export const submitResult = async (playdata_id: string, record: number, dq: string) => {
  try {
    const response = await apiClient.post('/judge/register', {
      id: playdata_id,
      record: record,
      dq: dq
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting result:", error);
    throw error;
  }
}