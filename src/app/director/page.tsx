"use client"

import { useEffect, useState, useRef } from "react";
import { getPlayStatus } from "@/api/director/client";

function LaneStatusPage() {
  const [data, setData] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5초마다 폴링
    return () => clearInterval(interval);
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

  const getCellColor = (dq: string, record: number, player: any) => {
    if (!player) return ""; // 빈 레인
    if (dq === "결장") return "bg-red-600";
    if (dq && dq !== "") return "bg-yellow-300";
    if (record && record > 0) return "bg-blue-500";
    return "bg-gray-400"; // 미경기
  };

  const handleDetail = (player: any) => {
    alert(`선수: ${player.player}\n팀: ${player.team}\n기록: ${formatRecord(player.record)}`);
  };

  const formatRecord = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };

  const getColumnStatusText = (colIndex: number) => {
    let hasPending = false;
    let hasFollowingConfirmed = false;
    let allDone = true;

    for (let lane = 1; lane <= 6; lane++) {
      const play = data[colIndex];
      const player = play?.player_list.find((p: any) => p.lane === lane);
      if (player && !player.dq && player.record === 0) {
        hasPending = true;
        allDone = false;
      }
      if (player && !player.dq && player.record !== 0) {
        allDone = allDone && true;
      }
    }

    for (let i = colIndex + 1; i < data.length; i++) {
      for (let lane = 1; lane <= 6; lane++) {
        const play = data[i];
        const player = play?.player_list.find((p: any) => p.lane === lane);
        if (player && !player.dq && player.record !== 0) {
          hasFollowingConfirmed = true;
          break;
        }
      }
      if (hasFollowingConfirmed) break;
    }

    if (allDone) return { label: "완료", color: "bg-green-700 text-white" };
    if (hasPending) return { label: "진행중", color: "bg-orange-400 text-white" };
    if (!hasPending && hasFollowingConfirmed) return { label: "오류!", color: "bg-red-600 text-white" };

    return { label: "", color: "" };
  };

  return (
    <div className="p-4 w-full">
      <div className="text-xl font-bold text-center mb-4">감독 기본 UI</div>

      <div className="overflow-x-auto whitespace-nowrap" ref={scrollRef}>
        <div
          className="inline-grid"
          style={{ gridTemplateColumns: `repeat(${data.length + 1}, minmax(3rem, 1fr))` }}
        >
          {/* Header with 상태 */}
          {data.map((col, index) => {
            const status = getColumnStatusText(index);
            return (
              <div key={`header-${col.play_num}`} className="border text-sm text-center">
                <div>{col.play_num}</div>
                <div className={`text-xs mt-1 ${status.color}`}>{status.label}</div>
              </div>
            );
          })}
          <div className="text-sm text-center p-1 border">상태</div>

          {/* Body */}
          {[1, 2, 3, 4, 5, 6].map((laneNum) => (
            <div key={`lane-${laneNum}`} className="contents">
              {data.map((play) => {
                const player = play.player_list.find((p: any) => p.lane === laneNum);
                return (
                  <button
                    key={`${play.play_num}-${laneNum}`}
                    className={`aspect-square border ${getCellColor(player?.dq, player?.record, player)}`}
                    onClick={() => player && handleDetail(player)}
                  />
                );
              })}
              <div className="aspect-square border bg-white"></div>
            </div>
          ))}

          {/* Empty row placeholder */}
          {data.map((_, index) => (
            <div key={`status-placeholder-${index}`}></div>
          ))}
          <div></div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 text-sm mt-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-600 border" /> 결장
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-300 border" /> DQ
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 border" /> 정상
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-400 border" /> 미경기
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border" /> 빈레인
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-700 border" /> 완료
        </div>
      </div>
    </div>
  );
}

export default LaneStatusPage;
