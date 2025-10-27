"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { getPlayStatus, reloadPlayStatus, updatePlayRecord } from "@/api/admin/client";
import { PlayerListType } from "@/types/lanes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props = { searchTerm?: string };

export default function CertiSelectPage({ searchTerm = "" }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [data, setData] = useState<{
    swimming_id: number;
    player_list: PlayerListType[];
  }[]>([]);

  const [selectedPlay, setSelectedPlay] = useState<PlayerListType[]>();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editDQ, setEditDQ] = useState("");

  // 기록 입력을 분/초/밀리초로 분리
  const [editMin, setEditMin] = useState(0);
  const [editSec, setEditSec] = useState(0);
  const [editMs, setEditMs] = useState(0);

  useEffect(() => {
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
    fetchData();
  }, []);

  // 세로 휠(deltaY)을 가로 스크롤로 변환
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // 가로 제스처가 더 크면 기본 동작 유지
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

  useEffect(() => {
    setSelectedPlay(data.find((play) => play.swimming_id === selectedCol)?.player_list)
  }, [selectedCol, data])

  const formatRecord = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };

  // 필터링 시 인덱스가 바뀌므로, 개별 play 기준으로 상태 계산하는 보조 함수
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
    if (allDone) return { label: "완료", color: "bg-green-700 text-white", done: true };
    if (hasPending) return { label: "진행중", color: "bg-orange-400 text-white", done: false };
    return { label: "", color: "", done: false };
  };

  const handleEditClick = (player: PlayerListType) => {
    setEditingRow(player.id);
    // ms를 분/초/밀리초로 분리
    const ms = player.record || 0;
    setEditMin(Math.floor(ms / 60000));
    setEditSec(Math.floor((ms % 60000) / 1000));
    setEditMs(ms % 1000);
    setEditDQ(player.dq || "");
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditMin(0);
    setEditSec(0);
    setEditMs(0);
    setEditDQ("");
  };

  const handleEditSave = async (swimming_id: number, id: number) => {
    if (!selectedPlay) return;
    // 입력값 보정
    const totalMs = editMin * 60000 + editSec * 1000 + editMs;

    const updateRes = await updatePlayRecord(swimming_id, id, totalMs, editDQ);
    if (updateRes === true) {
      const response = await reloadPlayStatus(swimming_id);
      const updated = response.data?.[0];
      if (updated) {
        setData(prevData => prevData.map(d =>
          d.swimming_id === swimming_id ? { ...d, player_list: updated.player_list } : d
        ));
        setSelectedPlay(updated.player_list);
      }
    }
    else {
      alert("수정 실패");
    }
    setEditingRow(null);
  };

  // 필터링: 검색어가 있으면 번호/이름/팀/종목/DQ 기준으로 필터
  const normalized = searchTerm.trim().toLowerCase();
  const isNumericOnly = /^\d+$/.test(normalized);
  const filtered = useMemo(() => {
    if (!normalized) return data;
    return data.filter((d) => {
      const inHeader = isNumericOnly
        ? d.swimming_id === Number(normalized)
        : String(d.swimming_id).toLowerCase().includes(normalized);
      const inPlayers = d.player_list?.some((p) => {
        return (
          (p.player ?? "").toLowerCase().includes(normalized) ||
          (p.team ?? "").toLowerCase().includes(normalized) ||
          (p.swimming_name ?? "").toLowerCase().includes(normalized) ||
          (p.dq ?? "").toLowerCase().includes(normalized)
        );
      });
      return Boolean(inHeader || inPlayers);
    });
  }, [data, isNumericOnly, normalized]);

  // 검색 결과가 바뀌면 첫 항목을 자동 선택
  useEffect(() => {
    if (!filtered || filtered.length === 0) {
      setSelectedCol(-1);
      return;
    }
    if (!filtered.some((d) => d.swimming_id === selectedCol)) {
      setSelectedCol(filtered[0].swimming_id);
    }
  }, [filtered, selectedCol]);

  return (
    <div>
      <div ref={scrollerRef} className="overflow-x-auto whitespace-nowrap">
        <div
          className="inline-grid"
          style={{ gridTemplateColumns: `repeat(${filtered.length + 1}, minmax(3rem, 1fr))` }}
        >
          {filtered.map((col) => {
            const status = getStatusForPlay(col);
            return (
              <div key={`header-${col.swimming_id}`} className={`border text-sm text-center ${selectedCol === col.swimming_id ? 'border-t-2 border-r-2 border-l-2 border-double border-red-500' : ''} cursor-pointer`}
                onClick={() => setSelectedCol(col.swimming_id)}
              >
                <div>{col.swimming_id}</div>
                <div className={`text-xs mt-1 ${status.color}`}>{status.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 경기 정보 표시 */}
      {
  selectedPlay && (
          <div className="mt-6 border p-4 rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-2 text-center">
              {selectedPlay[0].swimming_name}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>번호</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>소속</TableHead>
                  <TableHead>순위</TableHead>
                  <TableHead>기록</TableHead>
                  <TableHead>반칙</TableHead>
                  <TableHead></TableHead>
                  <TableHead>수정</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPlay.map((player, idx) => {
                  const isAllDone = getStatusForPlay({ player_list: selectedPlay }).done;
                  const isEditing = editingRow === player.id;
                  return (
                    <TableRow key={player.id} >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{player?.player}</TableCell>
                      <TableCell>{player?.team}</TableCell>
                      <TableCell>{player?.rank}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-1 items-center"> {/* input 3개 합친 너비에 맞춤 */}
                            <input
                              type="number"
                              min={0}
                              value={editMin}
                              onChange={e => setEditMin(Math.max(0, parseInt(e.target.value) || 0))}
                              className="border px-1 w-16 text-right"
                            />
                            :
                            <input
                              type="number"
                              min={0}
                              max={59}
                              value={editSec}
                              onChange={e => setEditSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                              className="border px-1 w-12 text-right"
                            />
                            .
                            <input
                              type="number"
                              min={0}
                              max={999}
                              value={editMs}
                              onChange={e => setEditMs(Math.min(999, Math.max(0, parseInt(e.target.value) || 0)))}
                              className="border px-1 w-16 text-right"
                            />
                          </div>
                        ) : (
                          formatRecord(player?.record || 0)
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <textarea
                            value={editDQ}
                            onChange={e => setEditDQ(e.target.value)}
                            className="border px-1 w-40 resize-none" // 더 넓고 높이 고정
                          />
                        ) : (
                          player?.dq
                        )}
                      </TableCell>
                      <TableCell>
                        {/* 인쇄 버튼: 수정 중이 아니고, 경기 완료이며, 입상자(1~3위)만 노출 */}
                        {!isEditing && isAllDone && player?.rank && player?.rank <= 3 &&
                          <Button
                            onClick={() => {
                              const params = new URLSearchParams({ id: String(player?.id ?? ""), swimming_id: String(selectedCol ?? "") });
                              window.open(`/bukguswim/admin/certificate/print?${params.toString()}`, '_blank');
                            }}>
                            인쇄
                          </Button>}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <>
                            <Button size="sm" className="mr-1" onClick={() => handleEditSave(selectedCol, player.id)}>완료</Button>
                            <Button size="sm" variant="secondary" onClick={handleEditCancel}>취소</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(player)}>수정</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )
      }
    </div >
  );
}
