import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function JudgeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>
}