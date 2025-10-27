import { parseJwt } from "@/utils/parseJwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginLayout ({children}:{children: React.ReactNode}) {
  const cookieStore = await cookies();
   const role = parseJwt(cookieStore.get("accessToken")?.value);
   
    if ([1, 2, 3, 4, 5, 6].includes(role)) {
      redirect("/judge");
    } else if (role === 7) {
      redirect("/director");
    } else if([0, 8].includes(role)){
      redirect("/admin");
    }
  
  return <>{children}</>
};