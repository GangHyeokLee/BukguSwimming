"use client"
import FoulPanel from "@/components/lane/FoulPanel";
import { SubmitDialog } from "@/components/lane/SubmitDialog";
import Timer from "@/components/lane/Timer";
import { useEffect, useState } from "react";

import { memo } from "react";
import { AbsentDialog } from "./AbsentDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ResponseProps {
  next: number | null;
  previous: number | null;
  record: number;
  dq: string;
  id: string;
}

function LaneClientComponent({ next, previous, record, dq, id }: ResponseProps) {
  const [time, setTime] = useState(0);
  const [foul, setFoul] = useState<string>("");

  useEffect(() => {
    setFoul(dq);
    setTime(record);
  }, [])

  return (
    <>
      <FoulPanel foul={foul} setFoul={setFoul} />
      <Timer time={time} setTime={setTime} />
      <div className="grid grid-cols-3 w-full items-center h-12">
        <div className="flex justify-start min-w-[80px]">
          {previous && (
            <Link href={`/judge/${previous}`} className="flex flex-row gap-1 items-center">
              <ChevronLeft />
              이전
            </Link>
          )}
        </div>

        <div className="flex justify-center">
          <SubmitDialog time={time} foul={foul} id={id} />
        </div>

        <div className="flex justify-end min-w-[80px]">
          {next && (
            <Link href={`/judge/${next}`} className="flex flex-row gap-1 items-center">
              다음
              <ChevronRight />
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(LaneClientComponent);