"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { parseJwt } from "@/utils/parseJwt";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth";

export const SidePanel = () => {

  const [role, setRole] = useState<number>(-1);
  const router = useRouter();

  useEffect(()=>{

    const response = parseJwt();
    if(!response){
      router.push("/login");
    }
    setRole(response);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {[1, 2, 3, 4, 5, 6].includes(role)?role + "번 레인 심판":(role === 7?"감독":"어드민")}
          </SheetTitle>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleLogout} className="my-5">로그아웃</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
} 