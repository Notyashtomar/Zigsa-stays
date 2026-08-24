import { getServerSession } from "next-auth";
import { AdminNav } from "@/components/AdminNav";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return children;
  }
  return (
    <div className="min-h-screen md:flex">
      <AdminNav />
      <div className="flex-1 bg-cream-100 p-4 sm:p-8">{children}</div>
    </div>
  );
}
