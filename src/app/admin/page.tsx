import { SidePanel } from "@/components/sidepanel/sidepanel"
import Link from "next/link"
import React from 'react'

export default function AdminPage() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-60 text-5xl text-center">

      <div className="grid grid-cols-3 items-center">
        <div></div>
        <div className="text-xl font-bold text-center mb-4">관리자 페이지</div>
        <div className="flex justify-end"><SidePanel /></div>
      </div>


      <Link href={"/admin/signup"} >회원가입</Link>
      <Link href={"/admin/certificate"} >상장</Link>
    </div>
  )
}
