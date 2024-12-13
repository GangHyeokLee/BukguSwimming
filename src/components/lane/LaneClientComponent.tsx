"use client"
import FoulPanel from "@/components/lane/FoulPanel";
import { SubmitDialog } from "@/components/lane/SubmitDialog";
import Timer from "@/components/lane/Timer";
import { useState } from "react";

import { memo } from "react";

function LaneClientComponent() {
  const [time, setTime] = useState(0);
  const [foul, setFoul] = useState<string>("없음");
  return (
    <>
      <FoulPanel foul={foul} setFoul={setFoul} />
      <Timer setTime={setTime} />
      <SubmitDialog time={time} foul={foul} />
    </>
  )
}

export default memo(LaneClientComponent);