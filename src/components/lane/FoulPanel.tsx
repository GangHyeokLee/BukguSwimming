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
    } else {
      setFoul("없음");
    }
  }, [customFoul, setFoul]);

  return (
    <div className="w-full flex flex-col gap-2">
      <Button className="whitespace-nowrap text-2xl font-bold py-2 h-fit border-1"
        onClick={() => {
          setFoul("없음")
          setCustomFoul("")
        }}
        variant={foul === "없음" ? "default" : "outline"}
      >없음</Button>
      <div className="grid grid-cols-3 gap-2">
        <Button
          className=" whitespace-nowrap text-lg font-bold"
          onClick={() => {
            setFoul("아메리카노")
            setCustomFoul("")
          }}
          variant={foul === "아메리카노" ? "destructive" : "outline"}
        >아메리카노</Button>
        <Button
          className=" whitespace-nowrap text-lg font-bold"
          onClick={() => {
            setFoul("라면")
            setCustomFoul("")
          }}
          variant={foul === "라면" ? "destructive" : "outline"}>라면</Button>
        <Button
          className=" whitespace-nowrap text-lg font-bold"
          onClick={() => {
            setFoul("수영하다 화장실")
            setCustomFoul("")
          }}
          variant={foul === "수영하다 화장실" ? "destructive" : "outline"}>수영하다 화장실</Button>
      </div>
      <Input type="text"
        className={`w-full ${customFoul.length > 0 && 'bg-red-200'}`}
        value={customFoul}
        onChange={(e) => setCustomFoul(e.target.value)}
      />
    </div>
  );
}

export default memo(FoulPanel);