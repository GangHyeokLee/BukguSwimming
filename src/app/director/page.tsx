"use client";

import DirectorPolling from "@/components/director/DirectorPolling";
import { SidePanel } from "@/components/sidepanel/sidepanel";
import { useState } from "react";

export default function LaneStatusPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div></div>
        <div className="text-xl font-bold text-center mb-4">감독 기본 UI</div>
        <div className="flex justify-end">
          <SidePanel onSearch={(text) => setSearchTerm(text)} />
        </div>
      </div>

  <DirectorPolling searchTerm={searchTerm} />
    </div>
  );
}
