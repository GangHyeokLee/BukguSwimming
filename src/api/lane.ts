import apiClient from "./apiClient"

export const getLanes = async () => {
  const response = await apiClient.get("/judge/all/seq");
  return response.data;
}

export const getLaneDetail = async () => {
  const response = await apiClient.get("/judge/req/seq");
  return response.data;
}