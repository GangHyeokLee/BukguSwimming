'use client'

import { signup } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import React, { useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Page() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLButtonElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const pwdCRef = useRef<HTMLInputElement>(null);

  const validation = () => {
    const checks = [
      { ref: idRef, value: id },
      { ref: nameRef, value: name },
      { ref: roleRef, value: role },
      { ref: pwdRef, value: password },
    ];

    for (const { ref, value } of checks) {
      if (ref.current && value.length === 0) {
        ref.current.focus();
        return false;
      }
    }

    if (
      pwdCRef.current &&
      password.length > 0 &&
      password !== passwordConfirm
    ) {
      pwdCRef.current.focus();
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    const response = await signup(id, name, password, role) as { code: number, message: string };
    if (response.code == 400) {
      alert("회원 등록에 실패했습니다.");
    }
    else if (response.code === 500) {
      alert(response.message);
    }
    else {
      alert('회원 등록에 성공했습니다.')
      router.push("/admin");
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation()) {
      handleSignup();
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && validation()) {
      e.preventDefault();
      handleSignup();
    }
  }
  return (
    <div className="px-3 flex flex-col justify-center items-center w-full h-screen">
      <div className="px-5 text-3xl font-bold flex flex-col gap-3 w-full">
        <div>{new Date().getFullYear()}년도 북구청장배</div>
        <div>수영대회 운영진 등록</div>
      </div>
      <form onSubmit={onSubmit}
        className="px-5 flex flex-col justify-center items-center w-full mt-10 gap-5">
        <div className="w-full flex flex-col gap-3">
          <label htmlFor="id" className="w-full">아이디</label>
          <Input
            ref={idRef}
            id="id" type="text" className="py-2 px-5 w-full text-xl h-fit" value={id}
            onChange={(e) => setId(e.target.value)} />
        </div>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="id" className="w-full">이름</label>
          <Input
            ref={nameRef}
            id="id" type="text" className="py-2 px-5 w-full text-xl h-fit" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="id" className="w-full">역할</label>
          <div className="w-full flex gap-3 justify-between">
            <Select onValueChange={(value) => setRole(value)}>
              <SelectTrigger ref={roleRef} className="w-full">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 Admin</SelectItem>
                <SelectItem value="1">1 JUDGE1</SelectItem>
                <SelectItem value="2">2 JUDGE2</SelectItem>
                <SelectItem value="3">3 JUDGE3</SelectItem>
                <SelectItem value="4">4 JUDGE4</SelectItem>
                <SelectItem value="5">5 JUDGE5</SelectItem>
                <SelectItem value="6">6 JUDGE6</SelectItem>
                <SelectItem value="7">7 Director</SelectItem>
                <SelectItem value="8">8 Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <label htmlFor="password" className="w-full">비밀번호</label>
          <div className="relative w-full">
            <Input
              ref={pwdRef}
              id="password"
              type={showPassword ? "text" : "password"}
              className="py-2 px-5 w-full pr-12 text-xl h-fit"  // right padding for the button
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LucideEye /> : <LucideEyeClosed />}
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="password" className="w-full">비밀번호 확인</label>
          <div className="relative w-full">
            <Input
              id="password"
              ref={pwdCRef}
              type={showPassword ? "text" : "password"}
              className="py-2 px-5 w-full pr-12 text-xl h-fit"  // right padding for the button
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LucideEye /> : <LucideEyeClosed />}
            </button>
          </div>
        </div>

        <Button type="submit"
          className="mt-5 text-xl px-5 py-2 w-full bg-gray-500 text-white rounded h-fit">회원가입</Button>
      </form>
    </div>
  )
}
