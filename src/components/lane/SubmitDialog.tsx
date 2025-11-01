import { submitResult } from "@/api/judge/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

interface SubmitDialogProps {
  time: number;
  foul: string;
  id: string;
}

export const SubmitDialog = ({ time, foul, id }: SubmitDialogProps) => {

  const handleSubmit = async () => {
    if (foul !== "결장" && time === 0) {
      alert("시간을 입력하세요.");
      return;
    }

    const resultTime = foul === "결장"
      ? (59 * 60000 + 59 * 1000 + 999)
      : time;

    await submitResult(id, resultTime, foul);
    alert("전송되었습니다.");
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit h-fit text-3xl py-3 px-10 font-bold">전송</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[400px] border-2 border-gray-200 rounded-lg">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle></DialogTitle>
          <DialogDescription className="text-xl font-bold text-black break-keep">
            결장 외에는 시간 기록을 반드시 해주세요.
          </DialogDescription>
          <div className="text-lg flex flex-col gap-2">
            <div className="text-3xl font-bold text-black whitespace-nowrap">
              {time > 60000 && `${Math.floor(time / 60000)}분`}
              &nbsp;
              {time > 1000 && `${Math.floor((time % 60000) / 1000)}.`}
              {time % 1000}초
            </div>
          </div>
          <hr />
          <div className="text-lg mt-5 flex flex-col gap-2">
            <div className="text-xl font-bold w-[280px] break-words">
              {foul ? foul : "반칙 없음"}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-5">
          <DialogClose asChild >
            <Button variant={"destructive"}>취소</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"default"} onClick={handleSubmit}>전송</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}