"use client";

import { useState } from "react";
import RightSideBar from "@/components/admin/RightSideBar";
import DirectorContent from "@/components/director/DirectorContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminDirectorPage() {
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/5">
          <RightSideBar />
        </div>
        <div className="w-4/5">
          <DirectorContent searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
