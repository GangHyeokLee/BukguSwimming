import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-60 text-5xl text-center">
      <Link href={"/login"} >로그인</Link>
      <Link href={"/judge"} >심판</Link>
      <Link href={"/director"} >감독</Link>
    </div>
  );
}
