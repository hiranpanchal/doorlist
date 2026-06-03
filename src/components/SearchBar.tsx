"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  defaultValue = "",
  variant = "hero",
}: {
  defaultValue?: string;
  variant?: "hero" | "compact";
}) {
  const [query, setQuery] = useState(defaultValue);
  const [type, setType] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (type) params.set("type", type);
    router.push(`/properties?${params.toString()}`);
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Town, city, postcode, or street..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-stretch bg-white rounded-2xl p-1.5 shadow-[0_20px_50px_-20px_rgba(10,40,70,0.45)] border border-border">
        <div className="flex-1 flex items-center gap-2.5 px-4 min-w-0">
          <Search className="w-5 h-5 text-muted flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Town, city, or postcode"
            className="w-full border-0 outline-none bg-transparent text-base py-3.5"
            style={{ color: "var(--color-ink)" }}
          />
        </div>
        <div className="w-px bg-border self-stretch my-2 hidden sm:block" />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="hidden sm:block border-0 outline-none bg-transparent text-sm px-4 font-medium cursor-pointer"
          style={{ color: "var(--color-ink-2)" }}
        >
          <option value="">Any type</option>
          <option value="flat">Flat</option>
          <option value="house">House</option>
          <option value="room">Room</option>
        </select>
        <button
          type="submit"
          className="text-white font-semibold px-7 py-3 rounded-xl text-base transition-colors flex-shrink-0"
          style={{ background: "#2d6ab5" }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
