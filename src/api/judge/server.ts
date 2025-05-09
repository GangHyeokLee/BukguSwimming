import { LaneDetailType } from "@/types/lanes";
import { cookies } from "next/headers";
import { serverApiClient } from '@/api/apiClients';

export const getLaneDetail = async (playdata_id: string, token?: string) => {
  console.log(playdata_id)
  try {
    const response = await serverApiClient.get(`/judge/req?playdata_id=${playdata_id}`, {
      headers: {
        Authorization: `Bearer ${(await cookies()).get("accessToken")?.value}`
      },
    });
    return response.data as LaneDetailType;
  }
  catch (error) {
    console.error("Error fetching lane detail:", error);
    throw error;
  }
}
