"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Users, CreditCard, Settings, LogOut, Shield, FileText, Search } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Listings", icon: Home, exact: false },
  { href: "/admin/customers", label: "Customers", icon: Users, exact: false },
  { href: "/admin/pages", label: "Pages", icon: FileText, exact: false },
  { href: "/admin/seo", label: "SEO", icon: Search, exact: false },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export default function AdminSidebar() {
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

      {/* Admin badge */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "var(--color-ink)" }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Admin Panel</p>
            <p className="text-xs text-muted">Platform management</p>
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
            </Link>
          );
        })}
      </nav>

      {/* Back to dashboard */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors w-full"
        >
          <LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Landlord Dashboard
        </Link>
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
