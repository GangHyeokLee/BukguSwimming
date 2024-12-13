

// const dummyGame={
//     type: "dummy",
// }
//
// const dummyPlayer = {
//     name: "test",
//     team: "testteam",
//     gender: "male",
// }

import LaneClientComponent from "@/components/lane/LaneClientComponent";

export default function LanePage() {



    return (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen gap-8">
            <div>
                경기 이름과 화살표
            </div>
            <div>
                선수 정보
            </div>
            <LaneClientComponent />
        </div>
    );
}
