import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Home, Mail, Eye, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect("/login");

  const properties = await prisma.property.findMany({
    where: { userId },
  });

  const unreadMessages = await prisma.message.count({
    where: { landlordId: userId, read: false, archived: false },
  });

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const activeCount = properties.filter(
    (p) => p.status === "active" || p.status === "available"
  ).length;

  return (
    <div className="max-w-5xl mx-auto">
      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Welcome back
      </h1>
      <p className="text-sm text-muted mb-8">
        Here&apos;s what&apos;s happening with your listings
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Listings", value: properties.length, color: "text-ink" },
          { label: "Active", value: activeCount, color: "text-emerald-600" },
          { label: "Total Views", value: totalViews, icon: Eye, color: "text-ink" },
          { label: "Unread Messages", value: unreadMessages, icon: Mail, color: unreadMessages > 0 ? "text-accent" : "text-ink" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/listings"
          className="bg-white rounded-2xl border border-border p-5 hover:border-border-2 transition-colors group"
        >
          <Home className="w-5 h-5 text-muted mb-3" strokeWidth={1.7} />
          <p className="font-semibold text-ink text-sm mb-1">Manage Listings</p>
          <p className="text-xs text-muted">View, edit, or renew your properties</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 group-hover:gap-2 transition-all">
            Go <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
        <Link
          href="/dashboard/messages"
          className="bg-white rounded-2xl border border-border p-5 hover:border-border-2 transition-colors group"
        >
          <Mail className="w-5 h-5 text-muted mb-3" strokeWidth={1.7} />
          <p className="font-semibold text-ink text-sm mb-1">Messages</p>
          <p className="text-xs text-muted">
            {unreadMessages > 0
              ? `You have ${unreadMessages} unread enquir${unreadMessages === 1 ? "y" : "ies"}`
              : "No new messages"}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 group-hover:gap-2 transition-all">
            Go <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
        <Link
          href="/dashboard/profile"
          className="bg-white rounded-2xl border border-border p-5 hover:border-border-2 transition-colors group"
        >
          <Home className="w-5 h-5 text-muted mb-3" strokeWidth={1.7} />
          <p className="font-semibold text-ink text-sm mb-1">Your Profile</p>
          <p className="text-xs text-muted">Update your info, logo, and bio</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent mt-3 group-hover:gap-2 transition-all">
            Go <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
