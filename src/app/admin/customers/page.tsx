import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: "landlord" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { properties: true, payments: true } },
      payments: {
        where: { status: "succeeded" },
        select: { amount: true },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-gray-900">
          Registered Customers ({users.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-5 py-3 font-medium text-muted">Customer</th>
              <th className="px-5 py-3 font-medium text-muted">Email</th>
              <th className="px-5 py-3 font-medium text-muted">Phone</th>
              <th className="px-5 py-3 font-medium text-muted">Joined</th>
              <th className="px-5 py-3 font-medium text-muted text-center">Listings</th>
              <th className="px-5 py-3 font-medium text-muted text-right">Total Spent</th>
              <th className="px-5 py-3 font-medium text-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const totalSpent = u.payments.reduce((sum, p) => sum + p.amount, 0);
              return (
                <tr key={u.id} className="hover:bg-surface/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{u.email}</td>
                  <td className="px-5 py-3 text-muted">{u.phone || "—"}</td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(u.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-center">{u._count.properties}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">
                    &pound;{(totalSpent / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/customers/${u.id}`}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted">
                  No customers registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
