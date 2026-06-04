"use client";

import { useRouter } from "next/navigation";
import { Star, Trash2, CheckCircle } from "lucide-react";

export default function AdminActions({
  propertyId,
  featured,
  status,
}: {
  propertyId: string;
  featured: boolean;
  status: string;
}) {
  const router = useRouter();

  async function toggleFeatured() {
    await fetch(`/api/admin/properties/${propertyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    router.refresh();
  }

  async function activate() {
    await fetch(`/api/admin/properties/${propertyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activate: true }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm("Remove this listing?")) return;
    await fetch(`/api/admin/properties/${propertyId}`, { method: "DELETE" });
    router.refresh();
  }

  const isActive = status === "active" || status === "available";

  return (
    <div className="flex items-center justify-center gap-2">
      {!isActive && (
        <button
          onClick={activate}
          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          title="Activate listing (free)"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={toggleFeatured}
        className={`p-1.5 rounded-lg transition-colors ${
          featured
            ? "bg-accent/10 text-accent-dark hover:bg-accent/20"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
        title={featured ? "Remove from featured" : "Feature this listing"}
      >
        <Star className={`w-4 h-4 ${featured ? "fill-accent" : ""}`} />
      </button>
      <button
        onClick={remove}
        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        title="Remove listing"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
