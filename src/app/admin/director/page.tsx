"use client";

import RightSideBar from "@/components/admin/RightSideBar";
import DirectorContent from "@/components/director/DirectorContent";

export default function AdminDirectorPage() {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div/>
        <div className="text-xl font-bold text-center mb-4">감독 화면</div>
        <div/>
      </div>

      <div className="flex gap-4">
        <div className="w-1/5">
          <RightSideBar />
        </div>
        <div className="w-4/5">
          <DirectorContent />
        </div>
      </div>
    </div>
  );
}
