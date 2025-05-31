import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import dojang from "@/assets/도장.png";

interface PreviewDialogProps {
  player: string;
  record: string;
  rank: number;
  swimming_name: string;
  team: string;
}

export default function PreviewDialog({ player, record, rank, swimming_name, team }: PreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">상장 출력</Button>
      </DialogTrigger>
      <DialogContent
        className="w-[595x] h-[842px] p-0 bg-white rounded-none shadow-none"
        style={{ maxWidth: 'unset' }}
      >        
      <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-[595px] h-[842px] bg-white px-[80px] py-[60px] text-center flex flex-col justify-between font-gulim text-black mx-auto">
          {/* 상장 번호 */}
          <div className="text-left text-base mb-2">제2024-101호</div>


          {/* 제목 */}
          <h1 className="text-6xl font-bold tracking-wider mb-6">상&nbsp;&nbsp;&nbsp;&nbsp;장</h1>

          {/* 상단 정보 */}
          <div className="text-left text-xl leading-10 grid grid-cols-2 mb-4">
            <p>종목: {swimming_name}</p>
            <p>순위: {rank}위</p>
            <p>종별: {swimming_name}</p>
            <p>소속: {team}</p>
            <p>기록: {record}</p>
            <p>성명: {player}</p>
          </div>

          {/* 본문 */}
          <div className="text-lg leading-9 whitespace-pre-line mt-6">
            위 사람은 대구광역시 북구체육회에서 주최하는<br />
            제 {swimming_name}에서 위와 같이 우수한 성적으로<br />
            입상하였기에 이 상장을 수여합니다.
          </div>

          {/* 하단 */}
          <div className="text-xl leading-8 mt-12">
            <p className="mb-2">{new Date().toLocaleDateString()}</p>
            <p className="relative z-10">대구광역시북구수영연맹</p>
            <div className="mt-2 relative inline-block">
               <img src={dojang.src} alt="도장" className="absolute right-[-80px] top-[-40px] z-0"
                style={{ width: '103px', height: '97.2px', opacity:0.6 }} />
              <p className="inline-block relative z-10">회장&nbsp;&nbsp;&nbsp;&nbsp;김&nbsp;&nbsp;&nbsp;기&nbsp;&nbsp;&nbsp;출</p>
             
            </div>
          </div>
        </div>
        <DialogFooter>
            <div className="absolute top-0 right-[-100px] flex flex-col gap-2 print:hidden">
    <DialogClose asChild>
      <Button variant="outline">닫기</Button>
    </DialogClose>
    <Button
  onClick={() => {
    const params = new URLSearchParams({
      player,
      record,
      rank: rank.toString(),
      swimming_name,
      team
    });
    window.open(`/admin/certificate/print?${params.toString()}`, '_blank');
  }}
>인쇄</Button>
  </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}