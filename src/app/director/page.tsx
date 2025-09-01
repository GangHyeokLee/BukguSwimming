"use client";

import DirectorContent from "@/components/director/DirectorContent";
import { SidePanel } from "@/components/sidepanel/sidepanel";

export default function LaneStatusPage() {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div></div>
        <div className="text-xl font-bold text-center mb-4">감독 기본 UI</div>
        <div className="flex justify-end"><SidePanel /></div>
      </div>

      <DirectorContent />
    </div>
  );
}
