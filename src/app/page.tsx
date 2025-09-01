import { logout } from "@/api/auth";
import { parseJwt } from "@/utils/parseJwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const role = parseJwt(token);

  if (!token) {
    redirect("/login");
  } else if ([1, 2, 3, 4, 5, 6].includes(role)) {
    redirect("/judge");
  } else if (role === 7) {
    redirect("/director");
  } else if ([0, 8].includes(role)) {
    redirect("/admin");
  } else {
    logout();
    redirect("/login");
  }
}