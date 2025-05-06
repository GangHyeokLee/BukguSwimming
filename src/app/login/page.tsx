"use client"

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/api/auth";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const idRef = useRef<HTMLInputElement>(null);
    const pwdRef = useRef<HTMLInputElement>(null);

    const validation = () => {
        if (idRef.current && id.length === 0) {
            idRef.current.focus();
        }

        if (pwdRef.current && password.length === 0) {
            pwdRef.current.focus();
        }

        return id.length > 0 && password.length > 0;
    }

    const handleLogin = async () => {
        const response = await login(id, password);
        if (!response) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validation()) {
            handleLogin();
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && validation()) {
            e.preventDefault();
            handleLogin();
        }
    }

    return (
        <div className="px-3 flex flex-col justify-center items-center w-full h-screen">
            <div className="px-5 text-3xl font-bold flex flex-col gap-3 w-full">
                <div>{new Date().getFullYear()}년도 북구청장배</div>
                <div>수영대회 운영진 페이지</div>
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

                <Button type="submit"
                    className="mt-5 text-xl px-5 py-2 w-full bg-gray-500 text-white rounded h-fit">로그인</Button>
            </form>
        </div>
    )
}
