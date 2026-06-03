"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  currentType: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentBedrooms: string;
  currentFurnished: string;
  currentPetFriendly: boolean;
  currentParking: boolean;
  currentGarden: boolean;
  currentSort: string;
  query: string;
};

export default function PropertyFilters({
  currentType,
  currentMinPrice,
  currentMaxPrice,
  currentBedrooms,
  currentFurnished,
  currentPetFriendly,
  currentParking,
  currentGarden,
  currentSort,
  query,
}: Props) {
  const router = useRouter();

  function applyFilters(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);

    const values: Record<string, string> = {
      type: currentType,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      bedrooms: currentBedrooms,
      furnished: currentFurnished,
      petFriendly: currentPetFriendly ? "true" : "",
      parking: currentParking ? "true" : "",
      garden: currentGarden ? "true" : "",
      sort: currentSort,
      ...overrides,
    };

    Object.entries(values).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    router.push(`/properties?${params.toString()}`);
  }

  const selectClass =
    "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const checkboxLabel = "flex items-center gap-2 text-sm text-gray-700 cursor-pointer";

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Property Type
          </label>
          <select
            className={selectClass}
            value={currentType}
            onChange={(e) => applyFilters({ type: e.target.value })}
          >
            <option value="">All types</option>
            <option value="house">House</option>
            <option value="flat">Flat</option>
            <option value="room">Room</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Price Range (pcm)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className={selectClass}
              value={currentMinPrice}
              onChange={(e) => applyFilters({ minPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max"
              className={selectClass}
              value={currentMaxPrice}
              onChange={(e) => applyFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Bedrooms
          </label>
          <select
            className={selectClass}
            value={currentBedrooms}
            onChange={(e) => applyFilters({ bedrooms: e.target.value })}
          >
            <option value="">Any</option>
            <option value="0">Studio</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Furnished
          </label>
          <select
            className={selectClass}
            value={currentFurnished}
            onChange={(e) => applyFilters({ furnished: e.target.value })}
          >
            <option value="">Any</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="part-furnished">Part Furnished</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-2">
            Amenities
          </label>
          <div className="space-y-2.5">
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={currentPetFriendly}
                onChange={(e) =>
                  applyFilters({ petFriendly: e.target.checked ? "true" : "" })
                }
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              Pet Friendly
            </label>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={currentParking}
                onChange={(e) =>
                  applyFilters({ parking: e.target.checked ? "true" : "" })
                }
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              Parking
            </label>
            <label className={checkboxLabel}>
              <input
                type="checkbox"
                checked={currentGarden}
                onChange={(e) =>
                  applyFilters({ garden: e.target.checked ? "true" : "" })
                }
                className="rounded border-border text-primary focus:ring-primary/20"
              />
              Garden
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Sort By
          </label>
          <select
            className={selectClass}
            value={currentSort}
            onChange={(e) => applyFilters({ sort: e.target.value })}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={() => router.push(`/properties${query ? `?q=${query}` : ""}`)}
          className="w-full text-sm text-primary hover:text-primary-light font-medium py-2 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
