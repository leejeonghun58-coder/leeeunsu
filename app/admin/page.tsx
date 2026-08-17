import AdminUploader from "@/components/AdminUploader";

export const metadata = {
  title: "관리자 | 특별한 이은수",
  description: "은수의 사진과 기록을 관리하는 공간",
};

export default function AdminPage() {
  return <AdminUploader />;
}
