import CertiSelectPage from "@/components/admin/CertiSelectPage";

export default function CertificatePage(){
  return (
    <div className = "p-4 w-full flex gap-3">
      <div className="w-1/5">
        // TODO 여기는 그거 사이드 탭? 들어가야댐
      </div>
      <div className = "w-4/5">
        <CertiSelectPage/>
      </div>
    </div>
  );
}