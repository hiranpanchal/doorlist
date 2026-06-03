"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal, List, Map } from "lucide-react";

export default function SearchFiltersToggle({
  query,
  showFilters,
}: {
  query: string;
  showFilters: boolean;
}) {
  const router = useRouter();

  function toggleFilters() {
    const params = new URLSearchParams(window.location.search);
    if (showFilters) {
      params.delete("filters");
    } else {
      params.set("filters", "true");
    }
    router.push(`/properties?${params.toString()}`);
  }

  const btnBase =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border";
  const btnActive = "bg-ink text-white border-ink";
  const btnInactive =
    "bg-white text-ink border-border-2 hover:bg-surface";

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleFilters}
        className={`${btnBase} ${showFilters ? btnActive : btnInactive}`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      <button className={`${btnBase} ${btnActive}`}>
        <List className="w-4 h-4" />
        List
      </button>
      <button className={`${btnBase} ${btnInactive}`}>
        <Map className="w-4 h-4" />
        Map
      </button>
    </div>
  );
}
