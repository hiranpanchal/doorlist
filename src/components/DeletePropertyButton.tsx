"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
