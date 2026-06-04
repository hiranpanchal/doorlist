"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, PlusCircle, LayoutDashboard, LogOut, Shield, User } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Image src="/logo.svg" alt="Doorlist" width={140} height={40} priority />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Search Properties
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Pricing
            </Link>

            {status === "loading" ? (
              <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ) : session?.user ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/list-property"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Listing
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 pl-2 border-l border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-muted hover:text-red-600 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  List Your Property
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/properties" className="block text-sm font-medium text-gray-600 hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
              Search Properties
            </Link>
            <Link href="/pricing" className="block text-sm font-medium text-gray-600 hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            {session?.user ? (
              <>
                {isAdmin ? (
                  <Link href="/admin" className="block text-sm font-medium text-gray-600 hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link href="/dashboard" className="block text-sm font-medium text-gray-600 hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/list-property" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                      <PlusCircle className="w-4 h-4" />
                      Add Listing
                    </Link>
                  </>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="block text-sm font-medium text-red-600 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm font-medium text-gray-600 hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  List Your Property
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
