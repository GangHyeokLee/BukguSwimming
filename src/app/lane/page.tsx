"use client"
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

    return (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen gap-5">
            <div>
                경기 이름과 화살표
            </div>
            <div>
                선수 정보
            </div>
            <div>
                반칙 설정칸
            </div>
            <Timer setTime={setTime} />
            <SubmitDialog time={time} />
        </div>
    );
}
