import apiClient from '@/api/apiClient';

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

export const getLaneDetail = async (playdata_id: number) => {
  const response = await apiClient.get(`/judge/req?playdata_id=${playdata_id}`);
  return response.data;
}