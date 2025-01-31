import dummyLanes from "@/dummy/dummyLanes.json";
import Link from "next/link";

function LaneListPage() {
  const laneNum = 1;
  const lanes = dummyLanes;

  return (
    <div className="px-3 py-20 flex flex-col justify-center w-full gap-8">
      <div className="text-2xl font-bold w-full text-center">{laneNum}번 레인 선수 목록</div>
      <table className="w-full max-w-2xl border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 whitespace-nowrap">
            <th className="py-2 text-center">번호</th>
            <th className="py-2 text-center">선수</th>
            <th className="py-2 text-center">소속</th>
            <th className="py-2 text-center">기록</th>
            <th className="py-2 text-center">반칙</th>
          </tr>
        </thead>
        <tbody>
          {lanes.map((lane, idx) => (
            <tr className="border-b border-gray-200 text-xl hover:bg-gray-100 cursor-pointer"
              key={lane.gameNumber + "-" + lane.laneNumber}>
              <td className="py-3 text-center" colSpan={5}>
                <Link href={`/judge/${idx}`} className="block">
                  <div className="grid grid-cols-5">
                    <div>{lane.gameNumber}</div>
                    <div>{lane.player}</div>
                    <div className="text-sm">{lane.team}</div>
                    <div className="text-sm">1분 20.3초</div>
                    <div className="text-lg">X</div>
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LaneListPage;
