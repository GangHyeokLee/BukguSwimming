"use client"
import FoulPanel from "@/components/lane/FoulPanel";
import { SubmitDialog } from "@/components/lane/SubmitDialog";
import { Timer } from "@/components/lane/Timer";
import { useState } from "react";

// const dummyGame={
//     type: "dummy",
// }
//
// const dummyPlayer = {
//     name: "test",
//     team: "testteam",
//     gender: "male",
// }

export default function LoginPage() {

    const [time, setTime] = useState(0);
    const [foul, setFoul] = useState<string>("없음");

    return (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen gap-12">
            <div>
                경기 이름과 화살표
            </div>
            <div>
                선수 정보
            </div>
            <FoulPanel foul={foul} setFoul={setFoul} />
            <Timer setTime={setTime} />
            <SubmitDialog time={time} foul={foul} />
        </div>
    );
}
