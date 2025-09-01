"use client"

import { useEffect, useState } from "react";
import { getTeamScore } from "@/api/admin/client";
import { TeamScoreItem } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RightSideBar from "@/components/admin/RightSideBar";

export default function TeamScoresPage() {
  const [teamScores, setTeamScores] = useState<TeamScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getTeamScore();
        setTeamScores(response.data);
      } catch {
        setError("팀 점수를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div/>
        <div className="text-xl font-bold text-center mb-4">팀 점수</div>
        <div/>
      </div>

      <div className="flex gap-4">
        <div className="w-1/5">
          <RightSideBar />
        </div>
        <div className="w-4/5">
          <div className="mt-2">
            {loading && <div className="text-sm text-gray-500">불러오는 중…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 tabular-nums">순위</TableHead>
                    <TableHead>팀</TableHead>
                    <TableHead className="w-24 text-right tabular-nums">점수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamScores.map((item, idx) => (
                    <TableRow key={`${item.team}-${idx}`}>
                      <TableCell className="tabular-nums">{idx + 1}위</TableCell>
                      <TableCell className="truncate">{item.team}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.total_score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
