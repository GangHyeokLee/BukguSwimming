import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SubmitDialogProps {
  time: number;
}

export const SubmitDialog = ({ time }: SubmitDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit h-fit text-3xl py-3 px-10 font-bold" variant={"outline"}>전송</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>확인</DialogTitle>
          <DialogDescription className={"text-lg"}>
              {time}
              <br/>
            {time > 60000 && `${Math.floor(time / 60000)}분`}
            &nbsp;
            {time > 1000 && `${Math.floor((time % 60000) / 1000)}.`}
            {time % 1000}초
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}