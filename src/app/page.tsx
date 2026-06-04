export const dynamic = "force-dynamic";
import Link from "next/link";
import { Check, ChevronRight, Users, Clock, MessageSquare, PoundSterling } from "lucide-react";
import { TrustpilotStars } from "@/components/TrustpilotStars";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/content";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";

export default async function HomePage() {
  const [featuredProperties, c, featuredReviews] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true, status: { in: ["available", "active"] } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    getContent(),
    prisma.review.findMany({
      where: { published: true, featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allReviews = await prisma.review.findMany({ where: { published: true } });
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 5;

  const overlayOpacity = parseInt(c.hero_overlay_opacity || "85") / 100;

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(165deg, ${c.hero_gradient_from} 0%, ${c.hero_gradient_to} 100%)` }}
      >
        {/* Background image */}
        {c.hero_image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${c.hero_image})`,
              opacity: 1 - overlayOpacity,
            }}
          />
        )}
        {/* Subtle radial overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 50%), radial-gradient(circle at 85% 70%, rgba(59,125,216,0.08), transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-36 lg:pt-40 lg:pb-44 text-center text-white">
          <div className="inline-flex items-center gap-2.5 mb-10 px-5 py-2.5 bg-white/[0.1] rounded-full text-sm font-semibold border border-white/[0.15]">
            <span className="w-2 h-2 rounded-full" style={{ background: c.hero_accent_color }} />
            {c.hero_badge}
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
            {c.hero_title_1}
            <br />
            <span style={{ color: c.hero_accent_color }}>{c.hero_title_2}</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-white/80 max-w-xl mx-auto mb-14">
            {c.hero_subtitle}
          </p>
          <div className="flex justify-center px-4 mb-10">
            <SearchBar />
          </div>
          <div className="flex flex-wrap gap-8 justify-center text-sm text-white/70 font-medium">
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: c.hero_accent_color }} /> {c.trust_1}
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: c.hero_accent_color }} /> {c.trust_2}
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2.4} style={{ color: c.hero_accent_color }} /> {c.trust_3}
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
                {c.featured_eyebrow}
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink"
                style={{
                  fontFamily: "var(--font-bricolage), sans-serif",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                {c.featured_title_1}
                <br />
                {c.featured_title_2}
                <br />
                <span className="text-accent">{c.featured_title_3}</span>
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

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
            >
              How it works
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-ink"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.025em" }}
            >
              Three steps to your next tenant
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: PoundSterling, title: "List your property", desc: "Create your listing in minutes. Add photos, details, and set your price. Pay just £29.99 for 30 days." },
              { step: "02", icon: Users, title: "Get direct enquiries", desc: "Tenants find your property and message you directly. No agents in the middle, no commission on your rental income." },
              { step: "03", icon: MessageSquare, title: "Choose your tenant", desc: "Review enquiries from your dashboard, arrange viewings, and pick the perfect tenant. You're in control." },
            ].map((item) => (
              <div key={item.step} className="relative p-8 rounded-2xl bg-white border border-border">
                <div
                  className="text-5xl font-extrabold mb-6"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "var(--color-border)" }}
                >
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 mb-4" style={{ color: "var(--color-accent)" }} strokeWidth={1.8} />
                <h3
                  className="text-lg font-bold text-ink mb-2"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Renters' Rights Act Banner */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 50%, #c3e6ec 100%)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div
                  className="inline-flex items-center gap-2 mb-5 px-3 py-1 bg-ink/10 rounded-full text-xs font-semibold w-fit"
                  style={{ color: "var(--color-ink)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Important Update
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-ink mb-4"
                  style={{
                    fontFamily: "var(--font-bricolage), sans-serif",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                  }}
                >
                  Renters&apos; Rights Act now in force: here&apos;s what you need to know
                </h2>
                <p className="text-sm text-ink/70 leading-relaxed mb-6 max-w-lg">
                  The biggest change to rental law in 40 years came into force on 1 May 2026. No fault evictions
                  are gone, rent increases are capped, and tenants can now keep pets. Whether you&apos;re a landlord
                  or tenant — this affects you.
                </p>
                <Link
                  href="/renters-rights-act"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-colors w-fit hover:bg-ink hover:text-white"
                  style={{ borderColor: "var(--color-ink)", color: "var(--color-ink)" }}
                >
                  Read the full guide <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div
                className="hidden lg:block min-h-[320px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — Trustpilot Style */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "var(--color-muted)", letterSpacing: "0.14em" }}
              >
                Reviews
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-ink mb-4"
                style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.025em" }}
              >
                Rated {avgRating.toFixed(1)} out of 5
              </h2>
              <div className="flex items-center gap-3">
                <TrustpilotStars rating={Math.round(avgRating)} />
                <span className="text-sm text-muted">
                  Based on {allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-2 text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              Read all reviews <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-border p-6">
                <TrustpilotStars rating={review.rating} size="sm" />
                {review.title && (
                  <p
                    className="font-bold text-ink mt-4 mb-2"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                  >
                    {review.title}
                  </p>
                )}
                <p className="text-sm text-ink-2 leading-relaxed mb-4">{review.body}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "#00b67a" }}
                  >
                    {review.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    <p className="text-xs text-muted">{review.role}</p>
                  </div>
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
            {c.pricing_eyebrow}
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink mb-6"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            {c.pricing_title_1}
            <br />
            {c.pricing_title_2}
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10">
            {c.pricing_subtitle}
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
        style={{ background: `linear-gradient(165deg, ${c.hero_gradient_from} 0%, ${c.hero_gradient_to} 100%)` }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent 50%), radial-gradient(circle at 80% 70%, rgba(59,125,216,0.08), transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-5"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.025em" }}
          >
            {c.cta_title}
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            {c.cta_subtitle}
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
