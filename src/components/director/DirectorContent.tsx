"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { getPlayStatus } from "@/api/director/client";
import { reloadPlayStatus, updatePlayRecord } from "@/api/admin/client";
import { PlayerListType } from "@/types/lanes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { parseJwt } from "@/utils/parseJwt";

type Props = { searchTerm?: string };

export default function DirectorContent({ searchTerm = "" }: Props) {
  const [selectedCol, setSelectedCol] = useState(-1);
  const [data, setData] = useState<{
    play_num: number;
    player_list: PlayerListType[];
  }[]>([]);
  const [selectedPlay, setSelectedPlay] = useState<PlayerListType[]>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editDQ, setEditDQ] = useState("");
  const [editMin, setEditMin] = useState(0);
  const [editSec, setEditSec] = useState(0);
  const [editMs, setEditMs] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 권한 파악: 1~6 레인, 7 감독이 아니면 어드민으로 간주
  useEffect(() => {
    const role = parseJwt();
    if (typeof role === "number" && ![1, 2, 3, 4, 5, 6, 7].includes(role)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    setSelectedPlay(data.find((play) => play.play_num === selectedCol)?.player_list);
  }, [selectedCol, data]);

  // 다른 경기가 선택되면 편집 상태 초기화
  useEffect(() => {
    setEditingRow(null);
    setEditDQ("");
    setEditMin(0);
    setEditSec(0);
    setEditMs(0);
  }, [selectedPlay]);

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

  // 세로 휠(deltaY)을 가로 스크롤로 변환 (데스크톱에서만 동작, 모바일 영향 없음)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // 가로 스크롤 제스처가 아닌 경우에만 전환
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const next = el.scrollLeft + e.deltaY;
      const canScrollLeft = e.deltaY < 0 && el.scrollLeft > 0;
      const canScrollRight = e.deltaY > 0 && el.scrollLeft < max;
      if (canScrollLeft || canScrollRight) {
        e.preventDefault();
        el.scrollLeft = Math.max(0, Math.min(max, next));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
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

  const handleEditClick = (player: PlayerListType) => {
    setEditingRow(player.id);
    const ms = player.record || 0;
    setEditMin(Math.floor(ms / 60000));
    setEditSec(Math.floor((ms % 60000) / 1000));
    setEditMs(ms % 1000);
    setEditDQ(player.dq || "");
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditDQ("");
    setEditMin(0);
    setEditSec(0);
    setEditMs(0);
  };

  const handleEditSave = async (swimming_id: number, id: number) => {
    const totalMs = editMin * 60000 + editSec * 1000 + editMs;
    const ok = await updatePlayRecord(swimming_id, id, totalMs, editDQ);
    if (ok === true) {
      const response = await reloadPlayStatus(swimming_id);
      const updated = response.data?.[0];
      if (updated) {
        // data에서 해당 수영 경기(swimming_id)를 포함하는 play를 찾아 player_list만 교체
        setData(prev => prev.map(d =>
          d.player_list.some(p => p.swimming_id === swimming_id)
            ? { ...d, player_list: updated.player_list }
            : d
        ));
        setSelectedPlay(updated.player_list);
      } else {
        // 안전망: 전체 재조회
        fetchData();
      }
    } else {
      alert("수정 실패");
    }
    setEditingRow(null);
  };

  // 검색 필터 (경기번호/이름/팀/종목/DQ). 숫자-only면 경기번호 정확히 일치
  const normalized = searchTerm.trim().toLowerCase();
  const isNumericOnly = /^\d+$/.test(normalized);
  const filtered = useMemo(() => {
    if (!normalized) return data;
    return data.filter((d) => {
      const inHeader = isNumericOnly
        ? d.play_num === Number(normalized)
        : String(d.play_num).toLowerCase().includes(normalized);
      const inPlayers = d.player_list?.some((p) => (
        (p.player ?? "").toLowerCase().includes(normalized) ||
        (p.team ?? "").toLowerCase().includes(normalized) ||
        (p.swimming_name ?? "").toLowerCase().includes(normalized) ||
        (p.dq ?? "").toLowerCase().includes(normalized)
      ));
      return Boolean(inHeader || inPlayers);
    });
  }, [data, isNumericOnly, normalized]);

  // 필터 결과 바뀌면 첫 항목 선택 (없으면 해제)
  useEffect(() => {
    if (!filtered || filtered.length === 0) {
      setSelectedCol(-1);
      return;
    }
    if (!filtered.some((d) => d.play_num === selectedCol)) {
      setSelectedCol(filtered[0].play_num);
    }
  }, [filtered, selectedCol]);

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

  // 필터와 무관하게 개별 play 기준 상태 계산
  const getStatusForPlay = (play?: { player_list?: PlayerListType[] }) => {
    let hasPending = false;
    let allDone = true;
    for (const player of play?.player_list ?? []) {
      if (player && !player.dq && player.record === 0) {
        hasPending = true;
        allDone = false;
      }
      if (player && !player.dq && player.record !== 0) {
        allDone = allDone && true;
      }
    }
    if (allDone) return { label: "완료", color: "bg-green-700 text-white" };
    if (hasPending) return { label: "진행중", color: "bg-orange-400 text-white" };
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
      <div className="overflow-x-auto whitespace-nowrap" ref={scrollRef}>
        <div
          className="inline-grid"
          style={{ gridTemplateColumns: `repeat(${filtered.length + 1}, minmax(3rem, 1fr))` }}
        >
          {filtered.map((col) => {
            const status = getStatusForPlay(col);
            return (
              <div key={`header-${col.play_num}`} className="border text-sm text-center whitespace-nowrap">
                <div>{col.play_num}</div>
                <div className={`text-xs mt-1 ${status.color}`}>{status.label}</div>
              </div>
            );
          })}
          <div className="text-sm text-center p-1 border whitespace-nowrap">상태</div>

      {[1, 2, 3, 4, 5, 6].map((laneNum) => (
            <div key={`lane-${laneNum}`} className="contents">
        {filtered.map((play) => {
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

          {filtered.map((_, index) => (
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
          <h2 className="text-lg font-semibold mb-2 text-center whitespace-nowrap">
            {selectedCol}번 경기
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">레인</TableHead>
                <TableHead className="whitespace-nowrap">이름</TableHead>
                <TableHead className="whitespace-nowrap">소속</TableHead>
                <TableHead className="whitespace-nowrap">순위</TableHead>
                <TableHead className="whitespace-nowrap">기록</TableHead>
                <TableHead className="whitespace-nowrap">반칙</TableHead>
                {isAdmin && <TableHead className="whitespace-nowrap">수정</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6].map((laneNum) => {
                const player = selectedPlay.find((p: PlayerListType) => p.lane === laneNum);
                return (
                  <TableRow key={`lane-${laneNum}`}>
                    <TableCell className="whitespace-nowrap">{laneNum}</TableCell>
                    <TableCell className="whitespace-nowrap">{player?.player}</TableCell>
                    <TableCell className="whitespace-nowrap">{player?.team}</TableCell>
                    <TableCell className="whitespace-nowrap">{player?.rank}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {isAdmin && editingRow === player?.id ? (
                        <div className="flex gap-1 items-center">
                          <input
                            type="number"
                            min={0}
                            value={editMin}
                            onChange={(e) => setEditMin(Math.max(0, parseInt(e.target.value) || 0))}
                            className="border px-1 w-16 text-right"
                          />
                          :
                          <input
                            type="number"
                            min={0}
                            max={59}
                            value={editSec}
                            onChange={(e) => setEditSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="border px-1 w-12 text-right"
                          />
                          .
                          <input
                            type="number"
                            min={0}
                            max={999}
                            value={editMs}
                            onChange={(e) => setEditMs(Math.min(999, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="border px-1 w-16 text-right"
                          />
                        </div>
                      ) : (
                        formatRecord(player?.record || 0)
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {isAdmin && editingRow === player?.id ? (
                        <textarea
                          value={editDQ}
                          onChange={(e) => setEditDQ(e.target.value)}
                          className="border px-1 w-40 resize-none"
                        />
                      ) : (
                        player?.dq
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="whitespace-nowrap">
                        {editingRow === player?.id ? (
                          <>
                            <Button size="sm" className="mr-1" onClick={() => player && handleEditSave(player.swimming_id, player.id)}>완료</Button>
                            <Button size="sm" variant="secondary" onClick={handleEditCancel}>취소</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => player && handleEditClick(player)}>수정</Button>
                        )}
                      </TableCell>
                    )}
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
