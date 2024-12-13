import LaneClientComponent from "@/components/lane/LaneClientComponent";
import dummyLanes from "@/dummy/dummyLanes.json";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function LanePage({ params }: PageProps) {

    const resolvedParams = await params;

    const response = dummyLanes[parseInt(resolvedParams.id)];

    return response ? (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen gap-8">
            <table className="w-full justify-between">
                <thead>
                    <tr>
                        <th className="w-1/3 text-center">
                            {response.previous ? <Link href={`/lane/${response.previous}`}>이전</Link> : <div></div>}
                        </th>
                        <th className="w-1/3 text-center">
                            <Link href={`/lane`}>목록</Link>
                        </th>
                        <th className="w-1/3 text-center">
                            {response.next && <Link href={`/lane/${response.next}`}>다음</Link>}
                        </th>
                    </tr>
                </thead>
            </table>
            <div className="flex gap-2 justify-center items-center text-xl">
                <p>{response.gameNumber}</p>
                <p>-</p>
                <p>{response.age}</p>
                <p>{response.gender}</p>
                <p>{response.event}</p>
                <p>{response.distance}</p>
            </div>
            <table className="w-full max-w-2xl border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="py-2 text-center w-1/6">레인</th>
                        <th className="py-2 text-center w-1/2">선수</th>
                        <th className="py-2 text-center w-1/3">소속</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-200 text-2xl">
                        <td className="py-3 text-center">{response.laneNumber}</td>
                        <td className="py-3 text-center">{response.player}</td>
                        <td className="py-3 text-center">{response.team}</td>
                    </tr>
                </tbody>
            </table>
            <LaneClientComponent />
        </div>
    ) : (
        <div>Not Found</div>
    );
}
