"use client"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { parseJwt } from "@/utils/parseJwt";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth";

type SidePanelProps = {
  onSearch?: (text: string) => void;
};

export const SidePanel = ({ onSearch }: SidePanelProps) => {

  const [role, setRole] = useState<number>(-1);
  const [keyword, setKeyword] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const router = useRouter();

  useEffect(()=>{

    const response = parseJwt();
    if(response === null){
      router.push("/login");
    }
    setRole(response);
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  }

  const handleSearch = () => {
    const value = keyword.trim();
    if (onSearch) onSearch(value);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {[1, 2, 3, 4, 5, 6].includes(role)?role + "번 레인 심판":(role === 7?"감독":"어드민")}
          </SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          <div className="text-sm font-medium">검색</div>
          <div className="flex gap-2">
            <Input
              placeholder="경기번호/이름/팀/종목/DQ"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleLogout} className="my-5 text-xl">로그아웃</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
} 