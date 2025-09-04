"use client"

import { useEffect, useState } from "react";
import { getPlayStatus } from "@/api/director/client";
import DirectorBoard, { DirectorPlay } from "./DirectorBoard";

type Props = { searchTerm?: string };

export default function DirectorPolling({ searchTerm = "" }: Props) {
  const [data, setData] = useState<DirectorPlay[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await getPlayStatus();
      if (response.code === 200) {
        setData(response.data);
      } else {
        console.error("데이터를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  return <DirectorBoard data={data} searchTerm={searchTerm} />;
}
