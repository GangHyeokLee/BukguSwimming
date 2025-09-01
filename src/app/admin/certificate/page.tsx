import CertiSelectPage from "@/components/admin/CertiSelectPage";
import RightSideBar from "@/components/admin/RightSideBar";

export default function CertificatePage() {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-3 items-center">
        <div/>
        <div className="text-xl font-bold text-center mb-4">경기 결과</div>
        <div/>
      </div>
      <div className="flex gap-4">
        <div className="w-1/5">
          <RightSideBar/>
        </div>
        <div className="w-4/5">
          <CertiSelectPage />
        </div>
      </div>
    </div>
  );
}