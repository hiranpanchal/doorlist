import Link from "next/link";
import { Bed, Bath, Home, MapPin, PawPrint, Car, Trees, Leaf, ChevronRight } from "lucide-react";

type Property = {
  id: string;
  title: string;
  propertyType: string;
  address: string;
  city: string;
  county: string;
  postcode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  furnished: string;
  petFriendly: boolean;
  parking: boolean;
  garden: boolean;
  epc: string;
  deposit: number;
  images: string;
  availableFrom: string;
  featured: boolean;
};

function AmenityChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-2 text-ink-2 text-xs font-medium border border-border">
      {children}
    </span>
  );
}

export default function PropertyRowCard({ property }: { property: Property }) {
  const typeLabel =
    property.propertyType === "flat"
      ? "Flat"
      : property.propertyType === "house"
        ? "House"
        : property.propertyType === "room"
          ? "Room"
          : "Property";

  const furnishedLabel =
    property.furnished === "furnished"
      ? "Furnished"
      : property.furnished === "part-furnished"
        ? "Part-furnished"
        : property.furnished === "unfurnished"
          ? "Unfurnished"
          : null;

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <article
        className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-150 hover:border-border-2 hover:shadow-[0_14px_34px_-22px_rgba(10,40,70,0.4)]"
        style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}
      >
        {/* Image */}
        <div className="relative bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center min-h-[230px] overflow-hidden">
          {property.images && property.images.split(",")[0] ? (
            <img src={property.images.split(",")[0]} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Home className="w-10 h-10 text-ink/20 mx-auto mb-1" />
              <span className="text-[11px] text-ink/30 uppercase tracking-wider">
                Property Photo
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {property.featured && (
              <span className="bg-accent text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                Featured
              </span>
            )}
          </div>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-ink text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border">
            {typeLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          {/* Title + Price */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3
                className="text-xl font-bold text-ink mb-1.5"
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.12,
                }}
              >
                {property.title}
              </h3>
              <div className="flex items-center gap-1.5 text-muted text-sm">
                <MapPin className="w-[15px] h-[15px]" strokeWidth={1.7} />
                {property.city}, {property.county}, {property.postcode}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-2xl font-bold text-ink"
                style={{ letterSpacing: "-0.02em" }}
              >
                &pound;{property.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted">per month</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-5 text-sm text-ink-2 font-medium">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Bed className="w-[17px] h-[17px]" strokeWidth={1.7} />
                {property.bedrooms} bed
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Bath className="w-[17px] h-[17px]" strokeWidth={1.7} />
                {property.bathrooms} bath
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="w-[17px] h-[17px]" strokeWidth={1.7} />
              EPC {property.epc}
            </span>
            {furnishedLabel && (
              <span className="text-muted">{furnishedLabel}</span>
            )}
          </div>

          {/* Amenity chips */}
          <div className="flex items-center gap-1.5">
            {property.petFriendly && (
              <AmenityChip>
                <PawPrint className="w-3 h-3" /> Pets
              </AmenityChip>
            )}
            {property.parking && (
              <AmenityChip>
                <Car className="w-3 h-3" /> Parking
              </AmenityChip>
            )}
            {property.garden && (
              <AmenityChip>
                <Trees className="w-3 h-3" /> Garden
              </AmenityChip>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            <span className="text-sm text-muted">
              Available{" "}
              {new Date(property.availableFrom).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {property.deposit > 0 &&
                ` · £${property.deposit.toLocaleString()} deposit`}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink font-semibold text-sm group-hover:gap-2.5 transition-all">
              View details <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
