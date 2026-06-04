"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Upload, Eye } from "lucide-react";

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  function update(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";
  const sectionTitle = "text-base font-bold text-ink mb-4";

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-2 rounded w-48" />
          <div className="h-64 bg-surface-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  const overlayOpacity = parseInt(content.hero_overlay_opacity || "85");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Homepage Content
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Edit the text, images, and colors on your homepage
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-ink hover:bg-surface transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero Preview */}
        <div
          className="rounded-2xl overflow-hidden relative text-white text-center p-12"
          style={{
            background: `linear-gradient(165deg, ${content.hero_gradient_from || "#06182b"} 0%, ${content.hero_gradient_to || "#0e3558"} 100%)`,
          }}
        >
          {content.hero_image && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${content.hero_image})`,
                opacity: (100 - overlayOpacity) / 100,
              }}
            />
          )}
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: content.hero_accent_color || "#3b7dd8" }} />
              {content.hero_badge}
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-3"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.03em", lineHeight: 1.02 }}
            >
              {content.hero_title_1}
              <br />
              <span style={{ color: content.hero_accent_color || "#3b7dd8" }}>{content.hero_title_2}</span>
            </h2>
            <p className="text-sm text-white/80 max-w-md mx-auto">{content.hero_subtitle}</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Hero Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input value={content.hero_badge || ""} onChange={(e) => update("hero_badge", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title Line 1</label>
                <input value={content.hero_title_1 || ""} onChange={(e) => update("hero_title_1", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Title Line 2 <span className="text-muted font-normal">(accent color)</span></label>
                <input value={content.hero_title_2 || ""} onChange={(e) => update("hero_title_2", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <textarea value={content.hero_subtitle || ""} onChange={(e) => update("hero_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Trust Point 1</label>
                <input value={content.trust_1 || ""} onChange={(e) => update("trust_1", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Trust Point 2</label>
                <input value={content.trust_2 || ""} onChange={(e) => update("trust_2", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Trust Point 3</label>
                <input value={content.trust_3 || ""} onChange={(e) => update("trust_3", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image & Overlay */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Hero Image &amp; Colors
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                <Upload className="w-4 h-4 inline mr-1.5" />
                Background Image URL
              </label>
              <input
                value={content.hero_image || ""}
                onChange={(e) => update("hero_image", e.target.value)}
                className={inputClass}
                placeholder="https://images.unsplash.com/photo-... (leave empty for solid gradient)"
              />
              <p className="text-xs text-muted mt-1">
                Use any image URL. The image appears behind the colored overlay.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Overlay Intensity — {overlayOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={(e) => update("hero_overlay_opacity", e.target.value)}
                className="w-full h-2 bg-surface-2 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>Image visible</span>
                <span>Full overlay</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Gradient Start</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.hero_gradient_from || "#06182b"}
                    onChange={(e) => update("hero_gradient_from", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    value={content.hero_gradient_from || "#06182b"}
                    onChange={(e) => update("hero_gradient_from", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Gradient End</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.hero_gradient_to || "#0e3558"}
                    onChange={(e) => update("hero_gradient_to", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    value={content.hero_gradient_to || "#0e3558"}
                    onChange={(e) => update("hero_gradient_to", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.hero_accent_color || "#3b7dd8"}
                    onChange={(e) => update("hero_accent_color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    value={content.hero_accent_color || "#3b7dd8"}
                    onChange={(e) => update("hero_accent_color", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Featured Properties Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input value={content.featured_eyebrow || ""} onChange={(e) => update("featured_eyebrow", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Heading Line 1</label>
                <input value={content.featured_title_1 || ""} onChange={(e) => update("featured_title_1", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Heading Line 2</label>
                <input value={content.featured_title_2 || ""} onChange={(e) => update("featured_title_2", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Heading Line 3 <span className="text-muted font-normal">(accent)</span></label>
                <input value={content.featured_title_3 || ""} onChange={(e) => update("featured_title_3", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tease */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Pricing Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input value={content.pricing_eyebrow || ""} onChange={(e) => update("pricing_eyebrow", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title Line 1</label>
                <input value={content.pricing_title_1 || ""} onChange={(e) => update("pricing_title_1", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Title Line 2</label>
                <input value={content.pricing_title_2 || ""} onChange={(e) => update("pricing_title_2", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <textarea value={content.pricing_subtitle || ""} onChange={(e) => update("pricing_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Call to Action
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Heading</label>
              <input value={content.cta_title || ""} onChange={(e) => update("cta_title", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <textarea value={content.cta_subtitle || ""} onChange={(e) => update("cta_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
          style={{ background: "var(--color-ink)" }}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
