import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-60 text-5xl">
        <Link href={"/login"} >로그인</Link>
        <Link href={"/lane"} >레인</Link>
    </div>
  );
}
