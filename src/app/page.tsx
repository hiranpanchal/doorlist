export const dynamic = "force-dynamic";
import Link from "next/link";
import { Check, PoundSterling, Zap, Shield, Users, Star, ArrowRight, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";

export default async function HomePage() {
  const featuredProperties = await prisma.property.findMany({
    where: { featured: true, status: { in: ["available", "active"] } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #06182b 0%, #0a2844 40%, #0e3558 100%)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 50%), radial-gradient(circle at 85% 70%, rgba(245,158,11,0.1), transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-36 lg:pt-40 lg:pb-44 text-center text-white">
          <div className="inline-flex items-center gap-2.5 mb-10 px-5 py-2.5 bg-white/[0.1] rounded-full text-sm font-semibold border border-white/[0.15]">
            <span className="w-2 h-2 rounded-full" style={{ background: "#3b7dd8" }} />
            No agency fees &middot; No hidden costs
          </div>
          <h1
            className="font-extrabold mb-10"
            style={{
              fontFamily: "var(--font-bricolage), var(--font-hanken), sans-serif",
              fontSize: "clamp(3rem, 7.5vw, 6.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Find your perfect
            <br />
            <span style={{ color: "#3b7dd8" }}>rental home.</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-white/80 max-w-xl mx-auto mb-14">
            The UK&apos;s marketplace for private landlords and tenants. Just
            great homes, direct.
          </p>
          <div className="flex justify-center px-4 mb-10">
            <SearchBar />
          </div>
          <div className="flex flex-wrap gap-8 justify-center text-sm text-white/70 font-medium">
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: "#3b7dd8" }} /> Verified Listings
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: "#3b7dd8" }} /> Just &pound;29.99/listing
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: "#3b7dd8" }} /> Direct to Landlord
            </span>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                [ 03 ] The Listing
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink"
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                Listings that
                <br />
                look like
                <br />
                <span className="text-accent">somebody cared.</span>
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              Browse rentals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

        </div>
      </section>

      {/* Why Door List */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why Choose Door List?
            </h2>
            <p className="text-muted mt-2 max-w-xl mx-auto">
              We connect landlords and tenants directly, cutting out the middleman
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PoundSterling className="w-7 h-7 text-accent-dark" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Just &pound;29.99
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                List your property for 30 days at one simple price.
                No commission, no hidden fees.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick &amp; Easy
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                List your property in minutes. Tenants can search, filter, and
                contact landlords instantly.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trusted &amp; Transparent
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Deal directly with verified landlords. No agents, no surprises,
                just honest renting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah T.",
                role: "Tenant",
                quote:
                  "Found my dream flat in just two days. No agency fees saved me over £500. Brilliant service!",
              },
              {
                name: "Mark R.",
                role: "Landlord",
                quote:
                  "Listed my property on Monday, had viewings booked by Wednesday. So much easier than using an agent.",
              },
              {
                name: "Priya K.",
                role: "Tenant",
                quote:
                  "Love being able to talk directly to the landlord. Everything was transparent from the start.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-xl p-6 border border-border"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tease */}
      <section className="py-24 lg:py-32 bg-surface-2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
          >
            [ 04 ] Pricing
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink mb-6"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            Free for one door.
            <br />
            Fair for the rest.
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10">
            Three plans, no per-applicant fees, no surprise charges, no
            contracts to escape from.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            See pricing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 lg:py-24 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(165deg, #06182b 0%, #0a2844 40%, #0e3558 100%)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent 50%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.08), transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-5"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Ready to get started?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Whether you&apos;re a landlord looking for quality tenants or a tenant
            searching for your next home, Doorlist has you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              List Your Property
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-white/15"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
