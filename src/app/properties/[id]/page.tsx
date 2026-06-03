import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Home, Bed, Bath, Leaf, Check, Camera,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import PropertyDetailPanel from "@/components/PropertyDetailPanel";
import ContactLandlordSidebar from "@/components/ContactLandlordSidebar";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) notFound();
  if (property.status === "draft") notFound();

  await prisma.property.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const landlordUser = property.userId
    ? await prisma.user.findUnique({
        where: { id: property.userId },
        select: { company: true, logo: true, city: true, bio: true },
      })
    : null;

  const landlordPropertyCount = await prisma.property.count({
    where: {
      userId: property.userId,
      status: { in: ["available", "active"] },
      ...(property.userId ? {} : { landlordEmail: property.landlordEmail }),
    },
  });

  const typeLabel =
    property.propertyType === "flat"
      ? "Flat"
      : property.propertyType === "house"
        ? "House"
        : property.propertyType === "room"
          ? "Room"
          : "Property";

  const features = [
    property.parking && "Parking",
    property.garden && "Garden",
    property.fireplace && "Fireplace",
    property.petFriendly && "Pets allowed",
    property.dssAccepted && "DSS / LHA accepted",
    property.studentFriendly && "Student friendly",
    property.familiesAllowed && "Families welcome",
    property.billsIncluded && "Bills included",
    property.furnished !== "unfurnished" &&
      (property.furnished === "furnished" ? "Furnished" : "Part-furnished"),
  ].filter(Boolean) as string[];

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
        >
          <Link href="/" className="hover:text-ink transition-colors">HOME</Link>
          {" "}&#8250;{" "}
          <Link href="/properties" className="hover:text-ink transition-colors">RENTALS</Link>
          {" "}&#8250;{" "}
          <span className="text-ink">REF {property.id.slice(-6).toUpperCase()}</span>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[420px]">
          <div className="col-span-2 row-span-2 relative bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center">
            <div className="text-center">
              <Home className="w-14 h-14 text-ink/15 mx-auto mb-2" />
              <span className="text-xs text-ink/30 uppercase tracking-wider">Main Photo</span>
            </div>
            <div className="absolute top-3 left-3 bg-ink/60 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> 1 / {property.images ? property.images.split(",").length : 1}
            </div>
          </div>
          {[2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="relative bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center"
            >
              <Home className="w-8 h-8 text-ink/10" />
              {n === 5 && (
                <div className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center text-white">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    View all photos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title Area */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Available
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
                >
                  REF {property.id.slice(-6).toUpperCase()}
                </span>
                <span className="text-xs text-muted">&middot;</span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
                >
                  Available{" "}
                  {new Date(property.availableFrom).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).toUpperCase()}
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-ink mb-2"
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                {property.title}
              </h1>
              <p className="text-base text-muted">
                {property.address}, {property.city}, {property.county} &middot; {property.postcode}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border mb-8">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : property.bedrooms.toString() },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms.toString() },
                { icon: Leaf, label: "EPC Rating", value: property.epc },
                { icon: Home, label: "Type", value: typeLabel },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-5">
                  <stat.icon className="w-5 h-5 text-ink/40 mb-3" strokeWidth={1.5} />
                  <div
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-xl font-bold text-ink"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* About this door */}
            <div className="mb-8">
              <h2
                className="text-xl font-bold text-ink mb-4"
                style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.02em" }}
              >
                About this door
              </h2>
              <p className="text-base text-ink-2 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <h2
                  className="text-xl font-bold text-ink mb-4"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.02em" }}
                >
                  Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 bg-surface-2 rounded-xl px-4 py-3"
                    >
                      <Check className="w-4 h-4 text-success flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-sm text-ink">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Panel */}
            <PropertyDetailPanel property={property} />
          </div>

          {/* Sidebar — Price & Contact */}
          <aside className="lg:w-[380px] flex-shrink-0">
            <ContactLandlordSidebar
              propertyId={property.id}
              propertyTitle={property.title}
              price={property.price}
              deposit={property.deposit}
              landlordName={property.landlordName}
              landlordEmail={property.landlordEmail}
              landlordCity={landlordUser?.city || property.city}
              landlordPropertyCount={landlordPropertyCount}
              landlordUserId={property.userId}
              imageCount={property.images ? property.images.split(",").filter(Boolean).length : 0}
              refCode={property.id.slice(-6).toUpperCase()}
              views={property.views}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
