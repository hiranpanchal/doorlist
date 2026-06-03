import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PropertyRowCard from "@/components/PropertyRowCard";
import SearchBar from "@/components/SearchBar";
import SearchFiltersToggle from "@/components/SearchFiltersToggle";
import PropertyFilters from "@/components/PropertyFilters";
import { Prisma } from "@prisma/client";
import { SlidersHorizontal, List, Map, Mail, ArrowRight } from "lucide-react";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const type = typeof params.type === "string" ? params.type : "";
  const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice) : undefined;
  const bedrooms = typeof params.bedrooms === "string" ? parseInt(params.bedrooms) : undefined;
  const furnished = typeof params.furnished === "string" ? params.furnished : "";
  const petFriendly = params.petFriendly === "true";
  const parking = params.parking === "true";
  const garden = params.garden === "true";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const showFilters = params.filters === "true";

  const where: Prisma.PropertyWhereInput = {
    status: { in: ["available", "active"] },
    ...(q && {
      OR: [
        { city: { contains: q } },
        { postcode: { contains: q } },
        { address: { contains: q } },
        { title: { contains: q } },
      ],
    }),
    ...(type && { propertyType: type }),
    ...(minPrice && { price: { gte: minPrice } }),
    ...(maxPrice && { price: { ...(minPrice ? { gte: minPrice } : {}), lte: maxPrice } }),
    ...(bedrooms && { bedrooms: { gte: bedrooms } }),
    ...(furnished && { furnished }),
    ...(petFriendly && { petFriendly: true }),
    ...(parking && { parking: true }),
    ...(garden && { garden: true }),
  };

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const properties = await prisma.property.findMany({ where, orderBy });

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
          >
            HOME &rsaquo; BROWSE RENTALS
          </div>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink mb-8"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.025em",
              lineHeight: 0.95,
            }}
          >
            {properties.length} {properties.length === 1 ? "door" : "doors"},
            <br />
            <span className="text-accent">open.</span>
          </h1>

          {/* Search + toggles */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex-1">
              <SearchBar defaultValue={q} variant="compact" />
            </div>
            <SearchFiltersToggle query={q} showFilters={showFilters} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Filters panel (collapsible) */}
            {showFilters && (
              <div className="mb-6">
                <PropertyFilters
                  currentType={type}
                  currentMinPrice={minPrice?.toString() || ""}
                  currentMaxPrice={maxPrice?.toString() || ""}
                  currentBedrooms={bedrooms?.toString() || ""}
                  currentFurnished={furnished}
                  currentPetFriendly={petFriendly}
                  currentParking={parking}
                  currentGarden={garden}
                  currentSort={sort}
                  query={q}
                />
              </div>
            )}

            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <p className="text-lg font-medium text-ink mb-2">
                  No properties found
                </p>
                <p className="text-sm text-muted">
                  Try adjusting your search or filters to find more results.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {properties.map((property) => (
                  <PropertyRowCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0 space-y-5">
            {/* Saved Search */}
            <div
              className="rounded-2xl p-6 text-white"
              style={{ background: "var(--color-ink)" }}
            >
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ letterSpacing: "0.14em", opacity: 0.6 }}
              >
                Saved Search
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Get alerts for
                <br />
                new doors.
              </h3>
              <p className="text-sm text-white/70 mb-5">
                We&apos;ll email you the moment a property in your area hits
                Doorlist.
              </p>
              <input
                type="email"
                placeholder="you@email.co.uk"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 mb-3"
              />
              <button className="w-full bg-white text-ink font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors">
                Save search
              </button>
            </div>

            {/* Landlord CTA */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                Are you a landlord?
              </div>
              <p
                className="text-lg font-bold text-ink mb-4"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                List your property in 5 minutes.
              </p>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-2 text-sm font-medium text-ink hover:bg-surface transition-colors"
              >
                Learn more
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
