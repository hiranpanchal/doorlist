import ContactForm from "@/components/ContactForm";

type PageData = {
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  body: string;
  contactForm: boolean;
  contactFields: string;
  contactEmail: string;
};

export default function StaticPage({ page }: { page: PageData }) {
  const fields = page.contactFields ? (() => {
    try { return JSON.parse(page.contactFields) as string[]; } catch { return []; }
  })() : [];

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white text-center py-20 lg:py-28"
        style={{ background: "linear-gradient(165deg, #06182b 0%, #0e3558 100%)" }}
      >
        {page.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${page.heroImage})`, opacity: 0.15 }}
          />
        )}
        <div className="relative max-w-3xl mx-auto px-6">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            {page.heroTitle || page.title}
          </h1>
          {page.heroSubtitle && (
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              {page.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose-doorlist"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />

          {page.contactForm && fields.length > 0 && (
            <div className="mt-12 pt-12 border-t border-border">
              <h2
                className="text-2xl font-bold text-ink mb-6"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Send us a message
              </h2>
              <ContactForm fields={fields} />
            </div>
          )}
        </div>
      </section>

      <style>{`
        .prose-doorlist { color: var(--color-ink-2); font-size: 16px; line-height: 1.75; }
        .prose-doorlist h2 { font-family: var(--font-bricolage), sans-serif; font-size: 24px; font-weight: 700; color: var(--color-ink); margin: 32px 0 12px; letter-spacing: -0.02em; }
        .prose-doorlist h3 { font-family: var(--font-bricolage), sans-serif; font-size: 20px; font-weight: 700; color: var(--color-ink); margin: 24px 0 8px; }
        .prose-doorlist p { margin-bottom: 16px; }
        .prose-doorlist ul, .prose-doorlist ol { margin-bottom: 16px; padding-left: 24px; }
        .prose-doorlist li { margin-bottom: 6px; }
        .prose-doorlist a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; }
        .prose-doorlist strong { color: var(--color-ink); font-weight: 600; }
        .prose-doorlist em { font-style: italic; color: var(--color-muted); }
        .prose-doorlist blockquote { border-left: 3px solid var(--color-accent); padding-left: 20px; color: var(--color-muted); font-style: italic; margin: 20px 0; }
        .prose-doorlist img { width: 100%; border-radius: 16px; object-fit: cover; max-height: 400px; }

        /* Key takeaways box */
        .prose-doorlist .key-takeaways {
          background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 60%, #c3e6ec 100%);
          border: 3px solid #a8d8e8;
          border-radius: 20px;
          padding: 36px 40px;
          margin: 40px 0;
        }
        .prose-doorlist .key-takeaways h2 { margin-top: 0; font-size: 22px; }
        .prose-doorlist .key-takeaways li { margin-bottom: 14px; line-height: 1.6; }

        /* Two column layout */
        .prose-doorlist .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin: 48px 0;
        }
        .prose-doorlist .two-col.reverse { direction: rtl; }
        .prose-doorlist .two-col.reverse > * { direction: ltr; }
        .prose-doorlist .two-col .col h2 { margin-top: 0; }
        .prose-doorlist .two-col .col img { height: 100%; min-height: 280px; }
        @media (max-width: 768px) {
          .prose-doorlist .two-col { grid-template-columns: 1fr; gap: 24px; }
          .prose-doorlist .two-col.reverse { direction: ltr; }
        }

        /* Highlight box */
        .prose-doorlist .highlight-box {
          background: linear-gradient(135deg, #06182b 0%, #0e3558 100%);
          color: white;
          border-radius: 20px;
          padding: 40px;
          margin: 48px 0;
        }
        .prose-doorlist .highlight-box h2 { color: white; margin-top: 0; }
        .prose-doorlist .highlight-box h3 { color: white; font-size: 17px; margin-top: 0; }
        .prose-doorlist .highlight-box p { color: rgba(255,255,255,0.75); }
        .prose-doorlist .highlight-box .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        .prose-doorlist .highlight-box .grid-item {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 24px;
        }
        @media (max-width: 768px) {
          .prose-doorlist .highlight-box .grid-2 { grid-template-columns: 1fr; }
          .prose-doorlist .highlight-box { padding: 28px; }
        }

        /* CTA box */
        .prose-doorlist .cta-box {
          background: var(--color-surface-2);
          border-radius: 20px;
          padding: 40px;
          margin: 48px 0;
          text-align: center;
        }
        .prose-doorlist .cta-box h2 { margin-top: 0; }
        .prose-doorlist .cta-box p { max-width: 520px; margin-left: auto; margin-right: auto; }
        .prose-doorlist .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: var(--color-ink);
          color: white !important;
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none !important;
          margin-top: 8px;
          transition: opacity 0.15s;
        }
        .prose-doorlist .cta-button:hover { opacity: 0.9; }
      `}</style>
    </>
  );
}
