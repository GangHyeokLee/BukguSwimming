"use client"

import dummyLanes from "@/dummy/dummyLanes.json";
import Link from "next/link";
import { useState } from "react";

function LaneListPage() {
  const laneNum = 1;
  const lanes = dummyLanes;
  const [lane, setlane] = useState<number>();

  return (
    <div className="px-3 py-20 flex flex-col justify-center w-full gap-8">
      <div className="text-2xl font-bold w-full text-center">선수 목록</div>
      <div className="grid grid-cols-6 gap-4">
        <div className="py-2 text-center">1 김아무개</div>
        <div className="py-2 text-center">2</div>
        <div className="py-2 text-center">3</div>
        <div className="py-2 text-center">4</div>
        <div className="py-2 text-center">5</div>
        <div className="py-2 text-center">6</div>
      </div>
    </div>
  );
}

export default LaneListPage;
