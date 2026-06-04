"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal, List, Map } from "lucide-react";

export default function SearchFiltersToggle({
  query,
  showFilters,
  view,
}: {
  query: string;
  showFilters: boolean;
  view: string;
}) {
  const router = useRouter();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/properties?${params.toString()}`);
  }

  function toggleFilters() {
    setParam("filters", showFilters ? null : "true");
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
      <button
        onClick={() => setParam("view", null)}
        className={`${btnBase} ${view !== "map" ? btnActive : btnInactive}`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => setParam("view", "map")}
        className={`${btnBase} ${view === "map" ? btnActive : btnInactive}`}
      >
        <Map className="w-4 h-4" />
        Map
      </button>
    </div>
  );
}
