import { getLaneDetail } from "@/api/judge/server";
import LaneClientComponent from "@/components/lane/LaneClientComponent";
import { SidePanel } from "@/components/sidepanel/sidepanel";
import { LaneDetailType } from "@/types/lanes";
import Link from "next/link";

export default async function LanePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const response: LaneDetailType = await getLaneDetail(id);

    return (response ? (
        <div className="px-3 flex flex-col py-10 w-full items-center gap-8">
            <div className="w-full max-w-2xl flex justify-between">
                <Link href="/judge">
                    <button className="px-3 py-1 rounded hover:bg-gray-300">
                        ← 목록
                    </button>
                </Link>
                <SidePanel/>
            </div>
            <div className="flex gap-2 justify-center items-center text-xl whitespace-nowrap">
                레인 {response.lane} - {response.swimming_name}
            </div>
            <table className="w-full max-w-2xl border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="py-2 text-center w-1/6 whitespace-nowrap">경기번호</th>
                        <th className="py-2 text-center w-1/2">선수</th>
                        <th className="py-2 text-center w-1/3">소속</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-200 text-2xl">
                        <td className="py-3 text-center">{response.play_num}</td>
                        <td className="py-3 text-center">{response.player}</td>
                        <td className="py-3 text-center">{response.team}</td>
                    </tr>
                </tbody>
            </table>
            <LaneClientComponent next={response.next} previous={response.prev} record={parseInt(response.record)} dq={response.dq} id={id} />
        </div>
    ) : (
        <div>
            Not Found
        </div>
    ))
}
