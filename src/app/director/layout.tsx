import { parseJwt } from "@/utils/parseJwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DirectorLayout ({children}:{children: React.PropsWithChildren}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token || ![0, 7, 8].includes(parseJwt(token))) {
    redirect("/login");
  }

  return <>{children}</>;
}