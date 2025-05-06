'use client'

import { getLanes } from "@/api/judge";
import dummyLanes from "@/dummy/dummyLanes.json";
import { LaneListType } from "@/types/lanes";
import { parseJwt } from "@/utils/parseJwt";
import Link from "next/link";
import { useEffect, useState } from "react";

function LaneListPage() {
  const [lane_num, setLane_num] = useState(0);
  const [lanes, setLanes] = useState<LaneListType[]>([]);

  useEffect(() => {
    setLane_num(parseJwt());
  }, [])

  useEffect(() => {
    if (lane_num != 0) {
      (async () => {
        console.log("get lanes")
        const response = await getLanes(lane_num);
        setLanes(response as LaneListType[]);

      })();
    }

  }, [lane_num])

  return (
    <div className="px-5 py-6 flex flex-col items-center w-full gap-6 overflow-x-hidden bg-gray-50">
      <div className="text-2xl font-bold text-center">
        {lane_num}번 레인 선수 목록
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {lanes.map((lane, idx) => (
          <Link
            key={lane.id}
            href={`/judge/${idx}`}
            className="block bg-white rounded-xl shadow-sm px-5 py-4 border border-gray-200 hover:bg-gray-100 transition-all"
          >
            <div className="flex items-baseline gap-10 justify-between w-full">
              <div className="text-2xl font-semibold mb-2 text-blue-900 whitespace-nowrap">
                {lane.play_num} - {lane.player.includes(',') ? lane.team : lane.player}
              </div>
              <div className="text-sm text-gray-500 truncate overflow-hidden text-ellipsis whitespace-nowrap">{lane.player.includes(',') ? lane.player : lane.team}</div>
            </div>

            <div className="items-center text-lg text-gray-700 mb-1">
              {lane.swimming_name}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-black">
                기록: {lane.record}
              </span>
              <span className={`text-lg font-semibold ${lane.dq ? 'text-red-600' : 'text-green-700'}`}>
                {lane.dq ? '반칙 있음' : '반칙 없음'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>

  );
}

export default LaneListPage;
