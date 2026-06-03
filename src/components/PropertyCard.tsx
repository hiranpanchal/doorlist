import Link from "next/link";
import { Bed, Bath, Home, MapPin, PawPrint, Car, Trees, Leaf, ChevronRight } from "lucide-react";

type Property = {
  id: string;
  title: string;
  propertyType: string;
  address: string;
  city: string;
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
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-[12px] font-medium border border-success/20">
      {children}
    </span>
  );
}

export default function PropertyCard({ property }: { property: Property }) {
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
        ? "Part furnished"
        : property.furnished === "unfurnished"
          ? "Unfurnished"
          : null;

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white rounded-2xl border border-border overflow-hidden card-hover">
        {/* Image area */}
        <div className="relative h-[210px] bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center">
          <div className="text-center">
            <Home className="w-10 h-10 text-ink/20 mx-auto mb-1" />
            <span className="text-[11px] text-ink/30 uppercase tracking-wider">
              Property Photo
            </span>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {property.featured && (
              <span className="bg-accent text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-ink text-[11px] font-medium px-2.5 py-1 rounded-full border border-border">
            {typeLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2.5">
          <div>
            <h3
              className="text-lg font-bold text-ink leading-tight mb-1"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.02em" }}
            >
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted text-[13px]">
              <MapPin className="w-[13px] h-[13px]" strokeWidth={1.7} />
              {property.city}, {property.postcode}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 text-[13.5px] text-ink-2 font-medium">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Bed className="w-4 h-4" strokeWidth={1.7} />
                {property.bedrooms} bed
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Bath className="w-4 h-4" strokeWidth={1.7} />
                {property.bathrooms} bath
              </span>
            )}
            {property.epc && (
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="w-4 h-4" strokeWidth={1.7} />
                EPC {property.epc}
              </span>
            )}
            {furnishedLabel && (
              <span className="text-muted font-medium">{furnishedLabel}</span>
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

          {/* Price footer */}
          <div className="flex items-end justify-between pt-3 border-t border-border mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-[23px] font-bold text-ink tracking-[-0.02em]">
                &pound;{property.price.toLocaleString()}
              </span>
              <span className="text-[13px] text-muted">/ month</span>
            </div>
            <span className="text-[12px] text-muted">
              Avail.{" "}
              {new Date(property.availableFrom).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
