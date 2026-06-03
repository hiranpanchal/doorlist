export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlusCircle, Eye, Clock, Pencil, RotateCcw } from "lucide-react";
import DeletePropertyButton from "@/components/DeletePropertyButton";

function getStatus(property: { paidAt: Date | null; expiresAt: Date | null; status: string }) {
  if (property.status === "draft" || !property.paidAt) return "draft";
  if (property.expiresAt && property.expiresAt < new Date()) return "expired";
  return "active";
}

function daysRemaining(expiresAt: Date | null) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-gray-50 text-gray-600 border-gray-200",
    expired: "bg-red-50 text-red-600 border-red-200",
  }[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${styles}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function DashboardListingsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect("/login");

  const properties = await prisma.property.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Your Listings
          </h1>
          <p className="text-sm text-muted mt-0.5">{properties.length} properties</p>
        </div>
        <Link
          href="/list-property"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ background: "var(--color-ink)" }}
        >
          <PlusCircle className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-lg font-medium text-ink mb-2">No listings yet</p>
          <p className="text-sm text-muted mb-4">Create your first property listing to get started.</p>
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--color-ink)" }}
          >
            <PlusCircle className="w-4 h-4" /> Add Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => {
            const status = getStatus(property);
            const days = daysRemaining(property.expiresAt);
            return (
              <div key={property.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ink truncate">{property.title}</h3>
                      <StatusBadge status={status} />
                    </div>
                    <p className="text-sm text-muted truncate">{property.address}, {property.city} {property.postcode}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                      <span className="font-medium text-ink text-sm">&pound;{property.price.toLocaleString()}/mo</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {property.views} views</span>
                      {status === "active" && (
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {days} days left</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {status === "draft" && (
                      <Link href={`/payment/${property.id}`} className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors" style={{ background: "var(--color-accent)" }}>
                        Pay &pound;29.99
                      </Link>
                    )}
                    {status === "expired" && (
                      <Link href={`/payment/${property.id}`} className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors" style={{ background: "var(--color-ink)" }}>
                        <RotateCcw className="w-3.5 h-3.5" /> Renew
                      </Link>
                    )}
                    <Link href={`/dashboard/edit/${property.id}`} className="inline-flex items-center gap-1.5 bg-surface hover:bg-surface-2 text-ink text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <DeletePropertyButton propertyId={property.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
