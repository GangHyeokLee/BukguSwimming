import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function JudgeLayout({ children }: { children: React.PropsWithChildren }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>
}