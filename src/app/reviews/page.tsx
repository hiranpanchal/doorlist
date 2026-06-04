export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { TrustpilotStars, TrustpilotBadge } from "@/components/TrustpilotStars";
import ReviewSubmitForm from "@/components/ReviewSubmitForm";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white text-center py-20"
        style={{ background: "linear-gradient(165deg, #06182b 0%, #0e3558 100%)" }}
      >
        <div className="relative max-w-3xl mx-auto px-6">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.025em" }}
          >
            What our users say
          </h1>
          <p className="text-lg text-white/70">Real reviews from real landlords and tenants</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-border p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <TrustpilotBadge rating={avgRating} count={reviews.length} />
            <div className="flex gap-6 text-center">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted w-3">{star}</span>
                    <div className="w-20 h-2 bg-surface-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#00b67a" }} />
                    </div>
                    <span className="text-xs text-muted w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#00b67a" }}>
                    {review.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    <p className="text-xs text-muted">{review.role}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <TrustpilotStars rating={review.rating} size="sm" />
                {review.title && (
                  <p className="font-semibold text-ink mt-3 mb-1" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
                    {review.title}
                  </p>
                )}
                <p className="text-sm text-ink-2 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="bg-surface-2 rounded-2xl p-8">
            <h2
              className="text-2xl font-bold text-ink mb-2"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Leave a review
            </h2>
            <p className="text-sm text-muted mb-6">
              Share your experience with Doorlist. Your review will be published after approval.
            </p>
            <ReviewSubmitForm />
          </div>
        </div>
      </section>
    </>
  );
}
