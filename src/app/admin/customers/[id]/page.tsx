export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft, User, Mail, Phone, Calendar, Home, Eye, CreditCard,
} from "lucide-react";

export default async function AdminCustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      properties: { orderBy: { createdAt: "desc" } },
      payments: {
        orderBy: { createdAt: "desc" },
        include: { property: { select: { title: true } } },
      },
    },
  });

  if (!user) notFound();

  const totalSpent = user.payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeListings = user.properties.filter(
    (p) => p.status === "active" || p.status === "available"
  ).length;

  return (
    <>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to customers
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.properties.length}</p>
          <p className="text-xs text-muted">Total Listings</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{activeListings}</p>
          <p className="text-xs text-muted">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.payments.length}</p>
          <p className="text-xs text-muted">Payments</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary-dark">
            &pound;{(totalSpent / 100).toFixed(2)}
          </p>
          <p className="text-xs text-muted">Total Spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
          </div>
          <div className="divide-y divide-border">
            {user.properties.map((p) => (
              <div key={p.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted">{p.city} &middot; &pound;{p.price.toLocaleString()}/mo</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Eye className="w-3 h-3" /> {p.views}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "active" || p.status === "available"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "draft" ? "bg-gray-50 text-gray-600" : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {user.properties.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-muted">No properties</p>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Payment History</h3>
          </div>
          <div className="divide-y divide-border">
            {user.payments.map((p) => (
              <div key={p.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {p.property?.title || "Unknown property"}
                    </p>
                    <p className="text-xs text-muted">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "Pending"}
                      {p.stripeSessionId && (
                        <span className="ml-2 text-gray-400">
                          {p.stripeSessionId.substring(0, 20)}...
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      &pound;{(p.amount / 100).toFixed(2)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "succeeded"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {user.payments.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-muted">No payments</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
