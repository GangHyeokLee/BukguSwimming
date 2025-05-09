import { submitResult } from "@/api/judge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface SubmitDialogProps {
  time: number;
  foul: string;
  id: string;
}

export const SubmitDialog = ({ time, foul, id }: SubmitDialogProps) => {

  const handleSubmit = async () => {
    const response = await submitResult(id, time, foul);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit h-fit text-3xl py-3 px-10 font-bold">전송</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[400px] border-2 border-gray-200 rounded-lg">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle></DialogTitle>
          <div className="text-lg flex flex-col gap-2">
            <div>시간</div>
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
        <DialogFooter>
          <DialogClose className="flex flex-row justify-center gap-5">
            <Button variant={"destructive"}>취소</Button>
            <Button variant={"default"} onClick={handleSubmit}>전송</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}