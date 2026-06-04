"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import ImageDropzone from "@/components/ImageDropzone";

type Page = {
  id: string;
  title: string;
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  body: string;
  contactForm: boolean;
  contactFields: string;
  contactEmail: string;
  published: boolean;
};

const AVAILABLE_FIELDS = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email Address" },
  { key: "phone", label: "Phone Number" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message" },
  { key: "company", label: "Company Name" },
  { key: "property_ref", label: "Property Reference" },
];

// Homepage content editor
function HomepageEditor() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => { setContent(data); setLoading(false); });
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

  const inputClass = "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";
  const sectionTitle = "text-base font-bold text-ink mb-4";

  if (loading) return <div className="animate-pulse h-64 bg-surface-2 rounded-2xl" />;

  const overlayOpacity = parseInt(content.hero_overlay_opacity || "85");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle className="w-4 h-4" /> Saved</span>}
          <a href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-ink hover:bg-surface transition-colors">
            <ExternalLink className="w-4 h-4" /> Preview
          </a>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50" style={{ background: "var(--color-ink)" }}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Hero Preview */}
      <div className="rounded-2xl overflow-hidden relative text-white text-center p-12" style={{ background: `linear-gradient(165deg, ${content.hero_gradient_from || "#06182b"} 0%, ${content.hero_gradient_to || "#0e3558"} 100%)` }}>
        {content.hero_image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${content.hero_image})`, opacity: (100 - overlayOpacity) / 100 }} />}
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: content.hero_accent_color || "#3b7dd8" }} />
            {content.hero_badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-bricolage), sans-serif", letterSpacing: "-0.03em", lineHeight: 1.02 }}>
            {content.hero_title_1}<br /><span style={{ color: content.hero_accent_color || "#3b7dd8" }}>{content.hero_title_2}</span>
          </h2>
          <p className="text-sm text-white/80 max-w-md mx-auto">{content.hero_subtitle}</p>
        </div>
      </div>

      {/* Hero Content */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Hero Section</h2>
        <div className="space-y-4">
          <div><label className={labelClass}>Badge Text</label><input value={content.hero_badge || ""} onChange={(e) => update("hero_badge", e.target.value)} className={inputClass} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Title Line 1</label><input value={content.hero_title_1 || ""} onChange={(e) => update("hero_title_1", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Title Line 2 <span className="text-muted font-normal">(accent)</span></label><input value={content.hero_title_2 || ""} onChange={(e) => update("hero_title_2", e.target.value)} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Subtitle</label><textarea value={content.hero_subtitle || ""} onChange={(e) => update("hero_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelClass}>Trust Point 1</label><input value={content.trust_1 || ""} onChange={(e) => update("trust_1", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Trust Point 2</label><input value={content.trust_2 || ""} onChange={(e) => update("trust_2", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Trust Point 3</label><input value={content.trust_3 || ""} onChange={(e) => update("trust_3", e.target.value)} className={inputClass} /></div>
          </div>
        </div>
      </div>

      {/* Hero Image & Colors */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Hero Image &amp; Colors</h2>
        <div className="space-y-4">
          <div><label className={labelClass}>Background Image</label><ImageDropzone value={content.hero_image || ""} settingKey="hero_image" onUploaded={(url) => update("hero_image", url)} /></div>
          <div>
            <label className={labelClass}>Overlay Intensity — {overlayOpacity}%</label>
            <input type="range" min="0" max="100" value={overlayOpacity} onChange={(e) => update("hero_overlay_opacity", e.target.value)} className="w-full h-2 bg-surface-2 rounded-full appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-muted mt-1"><span>Image visible</span><span>Full overlay</span></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelClass}>Gradient Start</label><div className="flex gap-2"><input type="color" value={content.hero_gradient_from || "#06182b"} onChange={(e) => update("hero_gradient_from", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" /><input value={content.hero_gradient_from || "#06182b"} onChange={(e) => update("hero_gradient_from", e.target.value)} className={inputClass} /></div></div>
            <div><label className={labelClass}>Gradient End</label><div className="flex gap-2"><input type="color" value={content.hero_gradient_to || "#0e3558"} onChange={(e) => update("hero_gradient_to", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" /><input value={content.hero_gradient_to || "#0e3558"} onChange={(e) => update("hero_gradient_to", e.target.value)} className={inputClass} /></div></div>
            <div><label className={labelClass}>Accent Color</label><div className="flex gap-2"><input type="color" value={content.hero_accent_color || "#3b7dd8"} onChange={(e) => update("hero_accent_color", e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" /><input value={content.hero_accent_color || "#3b7dd8"} onChange={(e) => update("hero_accent_color", e.target.value)} className={inputClass} /></div></div>
          </div>
        </div>
      </div>

      {/* Featured & Pricing Sections */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Featured Properties Section</h2>
        <div className="space-y-4">
          <div><label className={labelClass}>Eyebrow</label><input value={content.featured_eyebrow || ""} onChange={(e) => update("featured_eyebrow", e.target.value)} className={inputClass} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelClass}>Line 1</label><input value={content.featured_title_1 || ""} onChange={(e) => update("featured_title_1", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Line 2</label><input value={content.featured_title_2 || ""} onChange={(e) => update("featured_title_2", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Line 3 (accent)</label><input value={content.featured_title_3 || ""} onChange={(e) => update("featured_title_3", e.target.value)} className={inputClass} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Pricing &amp; CTA Sections</h2>
        <div className="space-y-4">
          <div><label className={labelClass}>Pricing Eyebrow</label><input value={content.pricing_eyebrow || ""} onChange={(e) => update("pricing_eyebrow", e.target.value)} className={inputClass} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Pricing Title 1</label><input value={content.pricing_title_1 || ""} onChange={(e) => update("pricing_title_1", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Pricing Title 2</label><input value={content.pricing_title_2 || ""} onChange={(e) => update("pricing_title_2", e.target.value)} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Pricing Subtitle</label><textarea value={content.pricing_subtitle || ""} onChange={(e) => update("pricing_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
          <div><label className={labelClass}>CTA Heading</label><input value={content.cta_title || ""} onChange={(e) => update("cta_title", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>CTA Subtitle</label><textarea value={content.cta_subtitle || ""} onChange={(e) => update("cta_subtitle", e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50" style={{ background: "var(--color-ink)" }}>
        {saving ? "Saving..." : "Save Homepage"}
      </button>
    </div>
  );
}

// Static page editor
function PageEditor({ page, onUpdate, onSave, saving, saved }: {
  page: Page;
  onUpdate: (key: string, value: string | boolean) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  function getContactFields(): string[] {
    if (!page.contactFields) return [];
    try { return JSON.parse(page.contactFields) as string[]; } catch { return []; }
  }

  function toggleField(fieldKey: string) {
    const fields = getContactFields();
    const updated = fields.includes(fieldKey) ? fields.filter((f) => f !== fieldKey) : [...fields, fieldKey];
    onUpdate("contactFields", JSON.stringify(updated));
  }

  const inputClass = "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";
  const sectionTitle = "text-base font-bold text-ink mb-4";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600"><CheckCircle className="w-4 h-4" /> Saved</span>}
          <a href={`/${page.slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-ink hover:bg-surface transition-colors">
            <ExternalLink className="w-4 h-4" /> Preview
          </a>
          <button onClick={onSave} disabled={saving} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50" style={{ background: "var(--color-ink)" }}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Hero Preview */}
      <div className="rounded-2xl overflow-hidden relative text-white text-center p-16" style={{ background: "linear-gradient(165deg, #06182b 0%, #0e3558 100%)" }}>
        {page.heroImage && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${page.heroImage})`, opacity: 0.2 }} />}
        <div className="relative">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>{page.heroTitle || page.title}</h2>
          <p className="text-white/70 text-sm">{page.heroSubtitle}</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Hero Section</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Hero Title</label><input value={page.heroTitle} onChange={(e) => onUpdate("heroTitle", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Hero Subtitle</label><input value={page.heroSubtitle} onChange={(e) => onUpdate("heroSubtitle", e.target.value)} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Hero Background Image</label><ImageDropzone value={page.heroImage} settingKey={`page_hero_${page.id}`} onUploaded={(url) => onUpdate("heroImage", url)} /></div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Page Content</h2>
        <RichTextEditor value={page.body} onChange={(val) => onUpdate("body", val)} />
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Contact Form</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
            <input type="checkbox" checked={page.contactForm} onChange={(e) => onUpdate("contactForm", e.target.checked)} className="rounded border-border" />
            Show contact form on this page
          </label>
          {page.contactForm && (
            <>
              <div><label className={labelClass}>Send submissions to</label><input value={page.contactEmail} onChange={(e) => onUpdate("contactEmail", e.target.value)} className={inputClass} placeholder="hello@doorlist.co.uk" /></div>
              <div>
                <label className={labelClass}>Form Fields</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {AVAILABLE_FIELDS.map((field) => {
                    const active = getContactFields().includes(field.key);
                    return (
                      <button key={field.key} onClick={() => toggleField(field.key)} className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left ${active ? "bg-accent/10 border-accent text-ink" : "bg-white border-border text-muted hover:border-border-2"}`}>
                        {active ? "✓ " : ""}{field.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Published */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={page.published} onChange={(e) => onUpdate("published", e.target.checked)} className="rounded border-border" />
          Page is published and visible to visitors
        </label>
      </div>

      <button onClick={onSave} disabled={saving} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50" style={{ background: "var(--color-ink)" }}>
        {saving ? "Saving..." : "Save Page"}
      </button>
    </div>
  );
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = useState<string>("homepage");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => { setPages(data); setLoading(false); });
  }, []);

  const current = pages.find((p) => p.id === activePage);

  function updatePage(key: string, value: string | boolean) {
    setPages((prev) => prev.map((p) => p.id === activePage ? { ...p, [key]: value } : p));
  }

  async function handleSavePage() {
    if (!current) return;
    setSaving(true);
    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(current),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-surface-2 rounded w-48" />
        <div className="h-64 bg-surface-2 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-ink mb-1" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Pages</h1>
      <p className="text-sm text-muted mb-6">Edit your homepage and site pages</p>

      {/* Page selector */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 overflow-x-auto">
        <button
          onClick={() => setActivePage("homepage")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activePage === "homepage" ? "bg-ink text-white" : "text-muted hover:bg-surface"}`}
        >
          Homepage
        </button>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activePage === page.id ? "bg-ink text-white" : "text-muted hover:bg-surface"}`}
          >
            {page.title}
          </button>
        ))}
      </div>

      {activePage === "homepage" ? (
        <HomepageEditor />
      ) : current ? (
        <PageEditor page={current} onUpdate={updatePage} onSave={handleSavePage} saving={saving} saved={saved} />
      ) : null}
    </div>
  );
}
