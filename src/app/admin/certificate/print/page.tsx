'use client';

import dojang from "@/assets/도장.png";
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react";

export default function PrintCertificate() {
  const searchParams = useSearchParams();
  const player = searchParams?.get('player')
  const record = searchParams?.get('record')
  const rank = searchParams?.get('rank')
  const swimming_name = searchParams?.get('swimming_name')
  const team = searchParams?.get('team')

  useEffect(() => {
    const handleAfterPrint = () => {
      window.close();
    };

    window.onafterprint = handleAfterPrint;

    // print 전에 렌더링 안정화 위해 약간 지연
    const timeoutId = setTimeout(() => {
      window.print();
    }, 1000);

    // 혹시 afterprint가 작동안할 경우 대비 예비 닫기
    const forceCloseTimeoutId = setTimeout(() => {
      window.close();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(forceCloseTimeoutId);
      window.onafterprint = null;
    };
  }, []);

  return (
    <div
      id="certificate-print"
      className="w-[595px] h-[842px] bg-white px-[80px] py-[60px] text-center flex flex-col justify-between font-gulim text-black mx-auto print:w-[595px] print:h-[842px]"
    >
      {/* 기존 상장 코드 그대로 복붙 */}
      <div className="text-left text-base mb-2">제2024-101호</div>
      <h1 className="text-6xl font-bold tracking-wider mb-6">상&nbsp;&nbsp;&nbsp;&nbsp;장</h1>
      <div className="text-left text-xl leading-10 grid grid-cols-2 mb-4">
        <p>종목: {swimming_name}</p>
        <p>순위: {rank}위</p>
        <p>종별: {swimming_name}</p>
        <p>소속: {team}</p>
        <p>기록: {record}</p>
        <p>성명: {player}</p>
      </div>
      <div className="text-lg leading-9 whitespace-pre-line mt-6">
        위 사람은 대구광역시 북구체육회에서 주최하는<br />
        제 {swimming_name}에서 위와 같이 우수한 성적으로<br />
        입상하였기에 이 상장을 수여합니다.
      </div>
      <div className="text-xl leading-8 mt-12">
        <p className="mb-2">2025년 5월 31일</p>
        <p className="relative z-10">대구광역시북구수영연맹</p>
        <div className="mt-2 relative inline-block">
          <img src={dojang.src} alt="도장" className="absolute right-[-80px] top-[-40px] z-0"
            style={{ width: '103px', height: '97.2px', opacity: 0.6 }} />
          <p className="inline-block relative z-10">회장&nbsp;&nbsp;&nbsp;&nbsp;김&nbsp;&nbsp;&nbsp;기&nbsp;&nbsp;&nbsp;출</p>
        </div>
      </div>
    </div>
  );
}
