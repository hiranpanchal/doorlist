import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user || role !== "admin") {
    redirect("/");
  }

  return (
    <div className="bg-surface min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-6 lg:p-8">{children}</div>
    </div>
  );
}
