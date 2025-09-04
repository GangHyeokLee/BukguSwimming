"use client";

import { useEffect, useState } from "react";
import RightSideBar from "@/components/admin/RightSideBar";
import DirectorBoard from "@/components/director/DirectorBoard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPlayStatus } from "@/api/director/client";
import { PlayerListType } from "@/types/lanes";

type DirectorPlay = {
  play_num: number;
  player_list: PlayerListType[];
};

export default function AdminDirectorPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<DirectorPlay[]>([]);

  const load = async () => {
    try {
      const res = await getPlayStatus();
      if (res.code === 200) setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // 최초 1회 로드만 수행 (폴링 없음)
    load();
  }, []);
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div/>
        <div className="text-xl font-bold text-center mb-4">감독 화면</div>
        <div className="flex items-center justify-end gap-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !(e as React.KeyboardEvent<HTMLInputElement>).nativeEvent.isComposing) {
                setSearchTerm(keywordInput);
              }
            }}
            placeholder="검색 (번호/이름/종목)"
            className="h-9 w-56"
          />
          <Button className="h-9" onClick={() => setSearchTerm(keywordInput)}>검색</Button>
          <Button className="h-9" variant="outline" onClick={load}>새로고침</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/5">
          <RightSideBar />
        </div>
        <div className="w-4/5">
          <DirectorBoard data={data} searchTerm={searchTerm} onRefresh={load} />
        </div>
      </div>
    </div>
  );
}
