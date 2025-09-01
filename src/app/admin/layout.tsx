import { parseJwt } from "@/utils/parseJwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react"

export default async function AdminLayout({children}:{children: React.PropsWithChildren}) {

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if(!token || ![0, 8].includes(parseJwt(token))){
    redirect("/login");
  }

  return <>{children}</>;
}