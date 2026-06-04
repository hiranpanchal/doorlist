export function TrustpilotStar({ filled }: { filled: boolean }) {
  return (
    <div
      className="w-7 h-7 flex items-center justify-center"
      style={{ background: filled ? "#00b67a" : "#dcdce6" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </div>
  );
}

export function TrustpilotStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-8 h-8" : "w-7 h-7";
  const starSize = size === "sm" ? 10 : size === "lg" ? 16 : 14;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`${sizeClass} flex items-center justify-center`}
          style={{ background: i <= rating ? "#00b67a" : "#dcdce6" }}
        >
          <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function TrustpilotBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <TrustpilotStars rating={Math.round(rating)} />
      <span className="text-sm font-semibold text-ink">
        {rating.toFixed(1)} out of 5
      </span>
      <span className="text-sm text-muted">
        Based on {count} {count === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
}
