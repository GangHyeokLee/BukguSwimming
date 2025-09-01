"use client"

import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { logout } from "@/api/auth";
import { Trophy } from "lucide-react";

export default function RightSideBar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="px-2">
        <div className="flex items-center gap-2 text-gray-800 whitespace-nowrap">
          <Trophy className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold tracking-wide">종목별 경기 결과</h2>
        </div>
        <div className="mt-2 h-px bg-gradient-to-r from-amber-500/70 to-transparent" />
      </div>

      <div className="px-2">
        <Button onClick={() => router.push('/admin/teamScores')} variant="outline" className="w-full justify-center">
          팀 점수 보기
        </Button>
      </div>

      <div className="w-full flex justify-center">
        <Button type="submit" onClick={handleLogout} className="my-5 text-xl">로그아웃</Button>
      </div>
    </div>
  );
}