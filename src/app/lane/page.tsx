import TimePicker from "@/components/lane/TimerApp";

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

    return (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen">
            <div>
                경기 이름과 화살표
            </div>
            <div>
                선수 정보
            </div>
            <div>
                반칙 설정칸
            </div>
            <TimePicker/>
            <div>
                전송버튼
            </div>
        </div>
    )
}
