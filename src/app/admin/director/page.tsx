"use client";

import Link from "next/link";
import RightSideBar from "@/components/admin/RightSideBar";
import DirectorContent from "@/components/director/DirectorContent";

export default function AdminDirectorPage() {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <Link href={"/admin"}>
          <button className="px-3 py-1 rounded hover:bg-gray-300">←</button>
        </Link>
        <div className="text-xl font-bold text-center mb-4">감독 화면</div>
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
