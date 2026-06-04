"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ExternalLink, ChevronRight } from "lucide-react";
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

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(data);
        if (data.length > 0) setActivePage(data[0].id);
        setLoading(false);
      });
  }, []);

  const current = pages.find((p) => p.id === activePage);

  function updatePage(key: string, value: string | boolean) {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePage ? { ...p, [key]: value } : p
      )
    );
  }

  function getContactFields(): string[] {
    if (!current?.contactFields) return [];
    try { return JSON.parse(current.contactFields); } catch { return []; }
  }

  function toggleField(fieldKey: string) {
    const fields = getContactFields();
    const updated = fields.includes(fieldKey)
      ? fields.filter((f) => f !== fieldKey)
      : [...fields, fieldKey];
    updatePage("contactFields", JSON.stringify(updated));
  }

  async function handleSave() {
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

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Pages
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Edit your About Us, Contact, and Privacy pages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      {/* Page selector */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === page.id
                ? "bg-ink text-white"
                : "text-muted hover:bg-surface"
            }`}
          >
            {page.title}
          </button>
        ))}
      </div>

      {current && (
        <div className="space-y-6">
          {/* Hero Preview */}
          <div
            className="rounded-2xl overflow-hidden relative text-white text-center p-16"
            style={{ background: "linear-gradient(165deg, #06182b 0%, #0e3558 100%)" }}
          >
            {current.heroImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${current.heroImage})`, opacity: 0.2 }}
              />
            )}
            <div className="relative">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                {current.heroTitle || current.title}
              </h2>
              <p className="text-white/70 text-sm">{current.heroSubtitle}</p>
            </div>
          </div>

          {/* Hero Settings */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2
              className="text-base font-bold text-ink mb-4"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Hero Section
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hero Title</label>
                  <input
                    value={current.heroTitle}
                    onChange={(e) => updatePage("heroTitle", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Subtitle</label>
                  <input
                    value={current.heroSubtitle}
                    onChange={(e) => updatePage("heroSubtitle", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Hero Background Image</label>
                <ImageDropzone
                  value={current.heroImage}
                  settingKey={`page_hero_${current.id}`}
                  onUploaded={(url) => updatePage("heroImage", url)}
                />
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-base font-bold text-ink"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Page Content
              </h2>
              <a
                href={`/${current.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs text-accent font-medium"
              >
                Preview <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <RichTextEditor
              value={current.body}
              onChange={(val) => updatePage("body", val)}
            />
          </div>

          {/* Contact Form Settings */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2
              className="text-base font-bold text-ink mb-4"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Contact Form
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={current.contactForm}
                  onChange={(e) => updatePage("contactForm", e.target.checked)}
                  className="rounded border-border"
                />
                Show contact form on this page
              </label>

              {current.contactForm && (
                <>
                  <div>
                    <label className={labelClass}>Send submissions to</label>
                    <input
                      value={current.contactEmail}
                      onChange={(e) => updatePage("contactEmail", e.target.value)}
                      className={inputClass}
                      placeholder="hello@doorlist.co.uk"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Form Fields</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {AVAILABLE_FIELDS.map((field) => {
                        const active = getContactFields().includes(field.key);
                        return (
                          <button
                            key={field.key}
                            onClick={() => toggleField(field.key)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left ${
                              active
                                ? "bg-accent/10 border-accent text-ink"
                                : "bg-white border-border text-muted hover:border-border-2"
                            }`}
                          >
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

          {/* Publishing */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={current.published}
                onChange={(e) => updatePage("published", e.target.checked)}
                className="rounded border-border"
              />
              Page is published and visible to visitors
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      )}
    </div>
  );
}
