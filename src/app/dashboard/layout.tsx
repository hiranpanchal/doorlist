import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/login");

  let unreadCount = 0;
  try {
    unreadCount = await prisma.message.count({
      where: { landlordId: userId, read: false, archived: false },
    });
  } catch {
    // table might not exist yet
  }

  return (
    <div className="bg-surface min-h-screen flex">
      <DashboardSidebar
        userName={session.user.name || ""}
        userEmail={session.user.email || ""}
        unreadCount={unreadCount}
      />
      <div className="flex-1 min-w-0 p-6 lg:p-8">{children}</div>
    </div>
  );
}
