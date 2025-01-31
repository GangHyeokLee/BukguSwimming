import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const AbsentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit h-fit text-3xl py-3 px-10 font-bold bg-red-500" >결장</Button>
      </DialogTrigger>
      <DialogContent className="w-fit min-w-[300px] max-w-[400px] border-2 border-gray-200 rounded-lg">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle>결장 처리 하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-5">
          <Button variant={"destructive"}>취소</Button>
          <Button variant={"default"}>전송</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}