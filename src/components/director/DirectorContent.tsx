"use client"

import { useEffect, useRef, useState } from "react";
import { getPlayStatus } from "@/api/director/client";
import { PlayerListType } from "@/types/lanes";
import { SidePanel } from "@/components/sidepanel/sidepanel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DirectorContent() {
  const [selectedCol, setSelectedCol] = useState(-1);
  const [data, setData] = useState<{
    play_num: number;
    player_list: PlayerListType[];
  }[]>([]);
  const [selectedPlay, setSelectedPlay] = useState<PlayerListType[]>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedPlay(data.find((play) => play.play_num === selectedCol)?.player_list);
  }, [selectedCol, data]);

  useEffect(() => {
    if (data.length === 0 || !scrollRef.current || hasScrolledRef.current) return;

    const index = findLastCompletedColumnIndex();
    if (index === -1) return;

    const cellWidth = scrollRef.current.scrollWidth / (data.length + 1);
    const scrollTo = cellWidth * index - scrollRef.current.clientWidth / 2 + cellWidth / 2;

    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    hasScrolledRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  const getCellColor = (player: PlayerListType | undefined) => {
    if (!player) return "";
    if (player.dq === "결장") return "bg-red-600";
    if (player.dq && player.dq !== "") return "bg-yellow-300";
    if (player.record && player.record > 0) return "bg-blue-500";
    return "bg-gray-400";
  };

  const formatRecord = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
  };

  const getColumnStatusText = (colIndex: number) => {
    let hasPending = false;
    let hasFollowingConfirmed = false;
    let allDone = true;

    for (let lane = 1; lane <= 6; lane++) {
      const play = data[colIndex];
      const player = play?.player_list.find((p: PlayerListType) => p.lane === lane);
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
        const player = play?.player_list.find((p: PlayerListType) => p.lane === lane);
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

  const findLastCompletedColumnIndex = () => {
    for (let i = data.length - 1; i >= 0; i--) {
      const status = getColumnStatusText(i);
      if (status.label === "완료") return i;
    }
    return -1;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 items-center">
        <div></div>
        <div className="text-xl font-bold text-center mb-4">감독 기본 UI</div>
        <div className="flex justify-end"><SidePanel /></div>
      </div>

      <div className="overflow-x-auto whitespace-nowrap" ref={scrollRef}>
        <div
          className="inline-grid"
          style={{ gridTemplateColumns: `repeat(${data.length + 1}, minmax(3rem, 1fr))` }}
        >
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

          {[1, 2, 3, 4, 5, 6].map((laneNum) => (
            <div key={`lane-${laneNum}`} className="contents">
              {data.map((play) => {
                const player = play.player_list.find((p: PlayerListType) => p.lane === laneNum);
                return (
                  <button
                    key={`${play.play_num}-${laneNum}`}
                    className={`aspect-square border ${getCellColor(player)} ${selectedCol === play.play_num ? "border-r-2 border-l-2 border-red-500" : ""}`}
                    onClick={() => setSelectedCol(play.play_num)}
                  />
                );
              })}
              <div className="aspect-square border bg-white"></div>
            </div>
          ))}

          {data.map((_, index) => (
            <div key={`status-placeholder-${index}`}></div>
          ))}
          <div></div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-sm mt-8">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 bg-red-600 border" /> 결장
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 bg-yellow-300 border" /> DQ
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 bg-blue-500 border" /> 정상
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 bg-gray-400 border" /> 미경기
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-5 h-5 border" /> 빈레인
        </div>
      </div>

      {selectedPlay && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2 text-center">
            {selectedPlay[0].swimming_name}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>레인</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>소속</TableHead>
                <TableHead>순위</TableHead>
                <TableHead>기록</TableHead>
                <TableHead>반칙</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6].map((laneNum) => {
                const player = selectedPlay.find((p: PlayerListType) => p.lane === laneNum);
                return (
                  <TableRow key={`lane-${laneNum}`}>
                    <TableCell>{laneNum}</TableCell>
                    <TableCell>{player?.player}</TableCell>
                    <TableCell>{player?.team}</TableCell>
                    <TableCell>{player?.rank}</TableCell>
                    <TableCell>{formatRecord(player?.record || 0)}</TableCell>
                    <TableCell>{player?.dq}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
