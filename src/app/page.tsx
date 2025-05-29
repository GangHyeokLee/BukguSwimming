import { parseJwt } from "@/utils/parseJwt";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = await cookies();
  const role = parseJwt(cookieStore.get("accessToken")?.value);

  if (!role) {
    redirect("/login");
  } else if ([1, 2, 3, 4, 5, 6].includes(role)) {
    redirect("/judge");
  } else if (role === 7) {
    redirect("/director");
  }

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-60 text-5xl text-center">
      <Link href={"/login"} >로그인</Link>
      <Link href={"/judge"} >심판</Link>
      <Link href={"/director"} >감독</Link>
    </div>
  );
}
