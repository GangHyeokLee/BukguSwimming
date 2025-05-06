import Link from "next/link"
import React from 'react'

export default function RootPage() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-60 text-5xl text-center">
      <Link href={"/admin/signup"} >회원가입</Link>
      <Link href={"/admin/certificate"} >상장</Link>
    </div>
  )
}
