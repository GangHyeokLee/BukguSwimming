import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoulPanelProps {
  foul: string;
  setFoul: React.Dispatch<React.SetStateAction<string>>;
}

const PRESETS = ["결장", "부정출발", "턴 반칙"] as const;
const isPreset = (v: string) => PRESETS.includes(v as (typeof PRESETS)[number]);

function FoulPanel({ foul, setFoul }: FoulPanelProps) {
  const [customFoul, setCustomFoul] = useState("");

  // ✅ 단방향 동기화: 부모의 foul이 바뀌면 입력창에만 반영
  useEffect(() => {
    if (!foul || isPreset(foul)) {
      if (customFoul !== "") setCustomFoul(""); // 프리셋/빈값이면 입력창 비움
    } else {
      if (customFoul !== foul) setCustomFoul(foul); // 커스텀이면 미러링
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foul]); // customFoul은 의도적으로 deps에서 제외

  // ✅ 입력 변화 시 두 상태를 동시에 갱신(이벤트 기반, useEffect 사용 안 함)
  const handleCustomChange = (value: string) => {
    setCustomFoul(value);
    if (value !== foul) setFoul(value); // 동일값이면 호출 안 함
  };

  // ✅ 프리셋 버튼 클릭
  const handlePreset = (p: string) => {
    if (customFoul !== "") setCustomFoul("");
    if (foul !== p) setFoul(p);
  };

  // ✅ 반칙 없음
  const handleNone = () => {
    if (customFoul !== "") setCustomFoul("");
    if (foul !== "") setFoul("");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        className="whitespace-nowrap text-2xl font-bold py-4 h-fit border-2"
        onClick={handleNone}
        variant={foul === "" ? "default" : "outline"}
      >
        반칙 없음
      </Button>

      <div className="grid grid-cols-3 gap-5">
        {PRESETS.map((p) => (
          <Button
            key={p}
            className={`whitespace-nowrap text-lg font-bold py-6 border-2 ${
              foul === p ? "border-red-500" : "border-black"
            }`}
            onClick={() => handlePreset(p)}
            variant={foul === p ? "destructive" : "outline"}
          >
            {p}
          </Button>
        ))}
      </div>

      <Input
        type="text"
        placeholder="예: 한손터치, 턴 미흡 등 직접 입력"
        className={`w-full ${customFoul.length > 0 ? "bg-red-200" : ""} text-xl py-2 border-2 h-fit`}
        value={customFoul}
        onChange={(e) => handleCustomChange(e.target.value)}
      />
    </div>
  );
}

export default memo(FoulPanel);
