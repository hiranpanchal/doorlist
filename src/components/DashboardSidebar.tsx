"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Mail, User, PlusCircle, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, exact: true },
  { href: "/dashboard/listings", label: "Listings", icon: Home, exact: false },
  { href: "/dashboard/messages", label: "Messages", icon: Mail, exact: false },
  { href: "/dashboard/profile", label: "Profile", icon: User, exact: false },
];

export default function DashboardSidebar({
  userName,
  userEmail,
  unreadCount,
}: {
  userName: string;
  userEmail: string;
  unreadCount: number;
}) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-border flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/">
          <Image src="/logo.svg" alt="Doorlist" width={120} height={34} />
        </Link>
      </div>

      {/* User */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{userName}</p>
            <p className="text-xs text-muted truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/10 text-ink"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${active ? "text-accent" : ""}`} strokeWidth={1.8} />
              {item.label}
              {item.label === "Messages" && unreadCount > 0 && (
                <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Add listing CTA */}
      <div className="p-3">
        <Link
          href="/list-property"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ background: "var(--color-ink)" }}
        >
          <PlusCircle className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
