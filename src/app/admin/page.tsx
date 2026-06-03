export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, Home, CreditCard, Eye } from "lucide-react";

export default async function AdminOverviewPage() {
  const users = await prisma.user.findMany({ where: { role: "landlord" } });
  const properties = await prisma.property.findMany();
  const payments = await prisma.payment.findMany({ where: { status: "succeeded" } });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const activeCount = properties.filter((p) => p.status === "active" || p.status === "available").length;
  const draftCount = properties.filter((p) => p.status === "draft").length;

  // Simple monthly revenue data (last 6 months)
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    const monthPayments = payments.filter((p) => {
      if (!p.paidAt) return false;
      return p.paidAt.getMonth() === d.getMonth() && p.paidAt.getFullYear() === d.getFullYear();
    });
    const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    months.push({ label, revenue, count: monthPayments.length });
  }
  const maxRevenue = Math.max(...months.map((m) => m.revenue), 1);

  return (
    <div className="max-w-6xl mx-auto">
      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Platform Overview
      </h1>
      <p className="text-sm text-muted mb-8">
        Key metrics across your platform
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Landlords", value: users.length, icon: Users, color: "text-ink" },
          { label: "Total Listings", value: properties.length, icon: Home, color: "text-ink" },
          { label: "Active", value: activeCount, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-ink" },
          { label: "Revenue", value: `£${(totalRevenue / 100).toFixed(2)}`, icon: CreditCard, color: "text-accent" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-muted" strokeWidth={1.7} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-1"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Revenue
          </h2>
          <p className="text-xs text-muted mb-6">Last 6 months</p>

          <div className="flex items-end gap-3 h-40">
            {months.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-ink">
                  {m.revenue > 0 ? `£${(m.revenue / 100).toFixed(0)}` : ""}
                </span>
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%`,
                    background: m.revenue > 0 ? "var(--color-accent)" : "var(--color-border)",
                    minHeight: 4,
                  }}
                />
                <span className="text-[10px] text-muted font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Listings Breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-1"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Listings Breakdown
          </h2>
          <p className="text-xs text-muted mb-6">By status</p>

          <div className="space-y-4">
            {[
              { label: "Active", value: activeCount, color: "#1f8a5b", total: properties.length },
              { label: "Draft", value: draftCount, color: "var(--color-muted)", total: properties.length },
              { label: "Featured", value: properties.filter((p) => p.featured).length, color: "var(--color-accent)", total: properties.length },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink">{item.label}</span>
                  <span className="text-sm font-bold text-ink">{item.value}</span>
                </div>
                <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                      background: item.color,
                      minWidth: item.value > 0 ? 8 : 0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Total properties</span>
              <span className="font-bold text-ink">{properties.length}</span>
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-1"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Recent Signups
          </h2>
          <p className="text-xs text-muted mb-4">Latest landlords</p>

          <div className="space-y-3">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--color-ink)" }}
                >
                  {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{u.name}</p>
                  <p className="text-xs text-muted truncate">{u.email}</p>
                </div>
                <span className="text-xs text-muted flex-shrink-0">
                  {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-muted text-center py-4">No signups yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-1"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Recent Listings
          </h2>
          <p className="text-xs text-muted mb-4">Latest properties added</p>

          <div className="space-y-3">
            {properties.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{p.title}</p>
                  <p className="text-xs text-muted">{p.city} &middot; £{p.price.toLocaleString()}/mo</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  p.status === "active" || p.status === "available"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-50 text-gray-600"
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
