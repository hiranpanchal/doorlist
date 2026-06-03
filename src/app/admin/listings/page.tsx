export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Home } from "lucide-react";
import AdminActions from "@/components/AdminActions";

export default async function AdminListingsPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        All Listings
      </h1>
      <p className="text-sm text-muted mb-6">{properties.length} properties on the platform</p>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-muted">Title</th>
                <th className="px-5 py-3 font-medium text-muted">Landlord</th>
                <th className="px-5 py-3 font-medium text-muted">City</th>
                <th className="px-5 py-3 font-medium text-muted">Status</th>
                <th className="px-5 py-3 font-medium text-muted">Price</th>
                <th className="px-5 py-3 font-medium text-muted text-center">Views</th>
                <th className="px-5 py-3 font-medium text-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50">
                  <td className="px-5 py-3 font-medium text-ink max-w-[220px] truncate">{p.title}</td>
                  <td className="px-5 py-3 text-muted">{p.user?.name || p.landlordName}</td>
                  <td className="px-5 py-3 text-muted">{p.city}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "active" || p.status === "available"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "draft" ? "bg-gray-50 text-gray-600" : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted">&pound;{p.price.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center text-muted">{p.views}</td>
                  <td className="px-5 py-3">
                    <AdminActions propertyId={p.id} featured={p.featured} />
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted">No listings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
