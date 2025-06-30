'use client';

import { printCertificate } from "@/api/admin/client";
import dojang from "@/assets/도장.png";
import { CertificateResponse } from "@/types/cert";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function PrintCertificate() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CertificateResponse | null>(null);
  const id = searchParams?.get('id')

  useEffect(() => {
    // const handleAfterPrint = () => {
    //   window.close();
    // };

    (async () => {
      if (id) {
        const res = await printCertificate(parseInt(id)) as CertificateResponse;
        setData(res);
      }
    })();

    // window.onafterprint = handleAfterPrint;

    // // print 전에 렌더링 안정화 위해 약간 지연
    // const timeoutId = setTimeout(() => {
    //   window.print();
    // }, 1000);

    // // 혹시 afterprint가 작동안할 경우 대비 예비 닫기
    // const forceCloseTimeoutId = setTimeout(() => {
    //   window.close();
    // }, 3000);

    // return () => {
    //   clearTimeout(timeoutId);
    //   clearTimeout(forceCloseTimeoutId);
    //   window.onafterprint = null;
    // };
  }, []);

  return data && (
    <div
      id="certificate-print"
      className="w-[595px] h-[842px] bg-white px-[100px] py-[120px] text-center flex flex-col justify-between font-gulim text-black mx-auto print:w-[595px] print:h-[842px]"
    >
      {/* 기존 상장 코드 그대로 복붙 */}
      <div className="text-left text-xl mb-2">제{data.cert_data.cert_num}호</div>
      <h1 className="text-8xl font-bold tracking-wider mb-6">상&nbsp;&nbsp;&nbsp;장</h1>
      <div className="flex flex-row mb-4 w-full gap-4 text-2xl whitespace-nowrap">
        {/* 왼쪽: 종목, 종별, 기록 */}
        <div className="flex flex-col items-start w-3/4">
          <p>종목: {data.swimming_data.swim_type}</p>
          <p>종별: {data.swimming_data.depart}&nbsp;{data.swimming_data.gender}&nbsp;{data.swimming_data.group}</p>
          <p>
            기록: {(() => {
              const ms = data.swimming_data.record;
              const min = Math.floor(ms / 60000);
              const sec = Math.floor((ms % 60000) / 1000) % 60;
              const msRemain = ms % 1000;
              return `${min}'${String(sec).padStart(2, '0')}"${String(msRemain).padStart(3, '0')}`;
            })()}
          </p>
        </div>
        {/* 오른쪽: 순위, 그룹, 성명 */}
        <div className="flex flex-col items-start w-fit">
          <p>순위: {data.swimming_data.rank}위</p>
          <p>소속: {data.swimming_data.team}</p>
          <p>성명: {data.swimming_data.player}</p>
        </div>
      </div>
      <div className="text-3xl text-left whitespace-pre-wrap mt-4 leading-loose">
        &nbsp;위 사람은 대구광역시 북구체육회에서 주최하는&nbsp;
        <strong>{data.cert_data.cert_name}</strong>에서 위와 같이 우수한 성적으로
        입상하였기에 이 상장을 수여합니다.
      </div>
      <div className="text-3xl leading-8 mt-8">
        <p className="mb-2 text-3xl">{
          (() => {
            const d = new Date();
            return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
          })()
        }</p>
        <br />
        <br />
        <p className="relative text-3xl font-bold z-10">대구광역시북구수영연맹</p>
        <div className="mt-2 relative inline-block">
          <img src={dojang.src} alt="도장" className="absolute right-[-80px] top-[-40px] z-0"
            style={{ width: '103px', height: '97.2px', opacity: 0.6 }} />
          <p className="inline-block text-3xl relative z-10">
            회장&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-4xl font-bold">
              {data.cert_data.president.split('').map((ch, i) => (
                <span key={i}>{ch}{i < data.cert_data.president.length - 1 ? '\u00A0\u00A0\u00A0' : ''}</span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
