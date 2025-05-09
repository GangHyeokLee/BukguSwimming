import { memo, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FoulPanelProps {
  foul: string;
  setFoul: React.Dispatch<React.SetStateAction<string>>;
}

function FoulPanel({ foul, setFoul }: FoulPanelProps) {

  const [customFoul, setCustomFoul] = useState("");

  useEffect(() => {
    if (customFoul.length > 0) {
      setFoul(customFoul);
    } else if (customFoul.length === 0 && foul !== "결장" && foul !== "부정출발" && foul !== "턴 반칙") {
      setFoul("");
    }
  }, [customFoul, foul, setFoul]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Button className="whitespace-nowrap text-2xl font-bold py-4 h-fit border-2"
        onClick={() => {
          setFoul("")
          setCustomFoul("")
        }}
        variant={foul === "" ? "default" : "outline"}>반칙 없음</Button>
      <div className="grid grid-cols-3 gap-5">
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "결장" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("결장")
          }}
          variant={foul === "결장" ? "destructive" : "outline"}>결장</Button>
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "부정출발" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("부정출발")
          }}
          variant={foul === "부정출발" ? "destructive" : "outline"}>부정출발</Button>
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "턴 반칙" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("턴 반칙")
          }}
          variant={foul === "턴 반칙" ? "destructive" : "outline"}>턴 반칙</Button>
      </div>
      <Input type="text"
        className={`w-full ${customFoul.length > 0 && 'bg-red-200'} text-xl py-2 border-2 h-fit`}
        value={customFoul}
        onChange={(e) => setCustomFoul(e.target.value)}
      />
    </div>
  );
}

export default memo(FoulPanel);