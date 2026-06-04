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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
      `}</style>
    </>
  );
}
