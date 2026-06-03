export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { CreditCard, TrendingUp } from "lucide-react";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      property: { select: { title: true } },
    },
  });

  const succeeded = payments.filter((p) => p.status === "succeeded");
  const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = succeeded.filter((p) => {
    if (!p.paidAt) return false;
    const now = new Date();
    return (
      p.paidAt.getMonth() === now.getMonth() &&
      p.paidAt.getFullYear() === now.getFullYear()
    );
  });
  const monthRevenue = thisMonth.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      {/* Revenue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary-dark">
            &pound;{(totalRevenue / 100).toFixed(2)}
          </p>
          <p className="text-xs text-muted">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            &pound;{(monthRevenue / 100).toFixed(2)}
          </p>
          <p className="text-xs text-muted">This Month</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{succeeded.length}</p>
          <p className="text-xs text-muted">Successful Payments</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {payments.filter((p) => p.status === "pending").length}
          </p>
          <p className="text-xs text-muted">Pending</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-gray-900">
            All Payments ({payments.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-muted">Date</th>
                <th className="px-5 py-3 font-medium text-muted">Customer</th>
                <th className="px-5 py-3 font-medium text-muted">Property</th>
                <th className="px-5 py-3 font-medium text-muted">Amount</th>
                <th className="px-5 py-3 font-medium text-muted">Status</th>
                <th className="px-5 py-3 font-medium text-muted">Expires</th>
                <th className="px-5 py-3 font-medium text-muted">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50">
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {p.paidAt
                      ? new Date(p.paidAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.user?.name}</p>
                      <p className="text-xs text-muted">{p.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-900 max-w-[180px] truncate">
                    {p.property?.title || "—"}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    &pound;{(p.amount / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "succeeded"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {p.expiresAt
                      ? new Date(p.expiresAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted font-mono">
                    {p.stripeSessionId
                      ? p.stripeSessionId.substring(0, 16) + "..."
                      : "—"}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    No payments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
