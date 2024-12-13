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
    } else if (customFoul.length === 0 && foul !== "DQ Type 1" && foul !== "DQ Type 2" && foul !== "DQ Type 3") {
      setFoul("없음");
    }
  }, [customFoul, foul, setFoul]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Button className="whitespace-nowrap text-2xl font-bold py-4 h-fit border-2"
        onClick={() => {
          setFoul("없음")
          setCustomFoul("")
        }}
        variant={foul === "없음" ? "default" : "outline"}>없음</Button>
      <div className="grid grid-cols-3 gap-5">
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "DQ Type 1" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("DQ Type 1")
          }}
          variant={foul === "DQ Type 1" ? "destructive" : "outline"}>DQ Type 1</Button>
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "DQ Type 2" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("DQ Type 2")
          }}
          variant={foul === "DQ Type 2" ? "destructive" : "outline"}>DQ Type 2</Button>
        <Button
          className={`whitespace-nowrap text-lg font-bold py-6 border-2  ${foul === "DQ Type 3" ? "border-red-500" : "border-black"}`}
          onClick={() => {
            setCustomFoul("")
            setFoul("DQ Type 3")
          }}
          variant={foul === "DQ Type 3" ? "destructive" : "outline"}>DQ Type 3</Button>
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