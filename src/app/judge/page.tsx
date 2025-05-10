'use client';

import { getLanes, getNowPlay } from "@/api/judge/client";
import { LaneListType } from "@/types/lanes";
import { parseJwt } from "@/utils/parseJwt";
import Link from "next/link";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 4;

function LaneListPage() {
  const [lane_num, setLane_num] = useState(0);
  const [lanes, setLanes] = useState<LaneListType[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(lanes.length / ITEMS_PER_PAGE);
  const currentLanes = lanes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setLane_num(parseJwt());
  }, []);

  useEffect(() => {
    if (lane_num !== 0) {
      (async () => {
        const response = await getLanes(lane_num);
        setLanes(response as LaneListType[]);

        const now = await getNowPlay(parseJwt() as number);
        if (now) {
          const index = (response as LaneListType[]).findIndex(
            (lane) => lane.play_num === now.play_num
          );

          if (index !== -1) {
            const newPage = Math.floor(index / ITEMS_PER_PAGE) + 1;
            setPage(newPage);
            setHighlightId(now.id);
          }
        }
      })();
    }
  }, [lane_num]);


  const renderPagination = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4 w-full max-w-2xl">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-lg text-gray-600 disabled:text-gray-300 shrink-0"
        >
          ◀
        </button>

        <div className="flex flex-1 justify-evenly items-center gap-2 overflow-hidden whitespace-nowrap">
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded text-sm ${num === page ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-lg text-gray-600 disabled:text-gray-300 shrink-0"
        >
          ▶
        </button>
      </div>
    );
  };



  return (
    <div className="px-5 py-6 flex flex-col items-center w-full gap-6 overflow-x-hidden bg-gray-50">
      <div className="text-2xl font-bold text-center">
        {lane_num}번 레인 선수 목록
      </div>

      {renderPagination()}

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {currentLanes.map((lane) => (
          <Link
            key={lane.id}
            href={`/judge/${lane.id}`}
            className={`
      block px-5 py-4 border border-gray-200 rounded-xl shadow-sm transition-all
      ${lane.id === highlightId ? "bg-blue-100 animate-fadeout" : "bg-white hover:bg-gray-100"}
    `}
          >
            <div className="flex items-baseline gap-10 justify-between w-full">
              <div className="text-2xl font-semibold mb-2 text-blue-900 whitespace-nowrap">
                {lane.play_num} - {lane.player.includes(',') ? lane.team : lane.player}
              </div>
              <div className="text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap max-w-[120px]">
                {lane.player.includes(',') ? lane.player : lane.team}
              </div>
            </div>

            <div className="items-center text-lg text-gray-700 mb-1">
              {lane.swimming_name}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-black">
                기록:  {`${String(Math.floor(lane.record / 60000)).padStart(2, '0')}:`}
                {`${String(Math.floor((lane.record % 60000) / 1000)).padStart(2, '0')}.`}
                {`${String(lane.record % 1000).padStart(3, '0')}`}
              </span>
              <span className={`text-lg font-semibold ${lane.dq ? 'text-red-600' : 'text-green-700'}`}>
                {lane.dq === "결장"?"결장" : lane.dq ? '반칙 있음' : '반칙 없음'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}

export default LaneListPage;
