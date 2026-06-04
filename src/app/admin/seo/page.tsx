"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle, Globe, Share2, Search, BarChart3,
  Shield, Code, ExternalLink, AlertCircle,
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((data) => {
        setSeo(data);
        setLoading(false);
      });
  }, []);

  function update(key: string, value: string) {
    setSeo((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seo),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";
  const helpClass = "text-xs text-muted mt-1";
  const sectionTitle = "text-base font-bold text-ink mb-4";

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "social", label: "Social / OG", icon: Share2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "advanced", label: "Advanced", icon: Code },
  ];

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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            SEO &amp; Social
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Optimise your site for search engines and social media
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-ink text-white"
                : "text-muted hover:bg-surface"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Page Title &amp; Description
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Site Title</label>
                <input value={seo.site_title || ""} onChange={(e) => update("site_title", e.target.value)} className={inputClass} />
                <p className={helpClass}>
                  {(seo.site_title || "").length}/60 characters — appears in browser tabs and Google results
                </p>
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea value={seo.site_description || ""} onChange={(e) => update("site_description", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                <p className={helpClass}>
                  {(seo.site_description || "").length}/160 characters — the snippet shown under your title in Google
                </p>
              </div>
              <div>
                <label className={labelClass}>Keywords</label>
                <input value={seo.site_keywords || ""} onChange={(e) => update("site_keywords", e.target.value)} className={inputClass} />
                <p className={helpClass}>Comma-separated — less important for Google now but still used by some engines</p>
              </div>
              <div>
                <label className={labelClass}>Site URL</label>
                <input value={seo.site_url || ""} onChange={(e) => update("site_url", e.target.value)} className={inputClass} placeholder="https://doorlist.co.uk" />
                <p className={helpClass}>Your production domain — used for canonical URLs and sitemaps</p>
              </div>
            </div>
          </div>

          {/* Google Preview */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              <Search className="w-4 h-4 inline mr-2" />
              Google Search Preview
            </h2>
            <div className="bg-surface rounded-xl p-5 max-w-xl">
              <p className="text-sm text-emerald-700 truncate">{seo.site_url || "https://doorlist.co.uk"}</p>
              <p className="text-lg text-blue-700 font-medium truncate mt-0.5">{seo.site_title || "Doorlist"}</p>
              <p className="text-sm text-muted mt-1 line-clamp-2">{seo.site_description || "No description set"}</p>
            </div>
          </div>

          {/* Indexing */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Search Engine Indexing
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={seo.robots_index === "true"}
                  onChange={(e) => update("robots_index", e.target.checked ? "true" : "false")}
                  className="rounded border-border"
                />
                Allow search engines to index this site
              </label>
              <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={seo.robots_follow === "true"}
                  onChange={(e) => update("robots_follow", e.target.checked ? "true" : "false")}
                  className="rounded border-border"
                />
                Allow search engines to follow links
              </label>
              {seo.robots_index !== "true" && (
                <div className="flex items-start gap-2 bg-amber-50 text-amber-800 text-xs p-3 rounded-lg mt-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Your site is currently hidden from search engines. Turn on indexing when you&apos;re ready to go live.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social / Open Graph */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Facebook / Open Graph
            </h2>
            <p className="text-xs text-muted mb-4">Controls how your site appears when shared on Facebook, LinkedIn, WhatsApp, and other platforms</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>OG Title</label>
                <input value={seo.og_title || ""} onChange={(e) => update("og_title", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>OG Description</label>
                <textarea value={seo.og_description || ""} onChange={(e) => update("og_description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>OG Image</label>
                <ImageDropzone
                  value={seo.og_image || ""}
                  settingKey="og_image"
                  onUploaded={(url) => update("og_image", url)}
                />
                <p className={helpClass}>Recommended: 1200x630px. This image appears when your site is shared on social media.</p>
              </div>
              <div>
                <label className={labelClass}>Facebook App ID</label>
                <input value={seo.fb_app_id || ""} onChange={(e) => update("fb_app_id", e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Facebook Preview */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Facebook Share Preview
            </h2>
            <div className="max-w-md rounded-lg border border-border overflow-hidden">
              <div className="h-40 bg-surface-2 flex items-center justify-center">
                {seo.og_image ? (
                  <img src={seo.og_image} alt="OG" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted">No image set — upload one above</span>
                )}
              </div>
              <div className="p-3 bg-surface">
                <p className="text-[10px] text-muted uppercase">{seo.site_url || "doorlist.co.uk"}</p>
                <p className="text-sm font-semibold text-ink truncate">{seo.og_title || "No title set"}</p>
                <p className="text-xs text-muted truncate">{seo.og_description || "No description set"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Twitter / X
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Card Type</label>
                <select value={seo.twitter_card || "summary_large_image"} onChange={(e) => update("twitter_card", e.target.value)} className={inputClass}>
                  <option value="summary_large_image">Large Image (recommended)</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input value={seo.twitter_title || ""} onChange={(e) => update("twitter_title", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={seo.twitter_description || ""} onChange={(e) => update("twitter_description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Twitter Image</label>
                <ImageDropzone
                  value={seo.twitter_image || ""}
                  settingKey="twitter_image"
                  onUploaded={(url) => update("twitter_image", url)}
                />
              </div>
              <div>
                <label className={labelClass}>Twitter Handle</label>
                <input value={seo.twitter_handle || ""} onChange={(e) => update("twitter_handle", e.target.value)} className={inputClass} placeholder="@doorlist" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Google Analytics
            </h2>
            <div>
              <label className={labelClass}>Measurement ID</label>
              <input value={seo.google_analytics_id || ""} onChange={(e) => update("google_analytics_id", e.target.value)} className={inputClass} placeholder="G-XXXXXXXXXX" />
              <p className={helpClass}>
                Find this in Google Analytics → Admin → Data Streams → your stream → Measurement ID
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Facebook Pixel
            </h2>
            <div>
              <label className={labelClass}>Pixel ID</label>
              <input value={seo.facebook_pixel_id || ""} onChange={(e) => update("facebook_pixel_id", e.target.value)} className={inputClass} placeholder="1234567890" />
              <p className={helpClass}>
                Find this in Facebook Events Manager → Data Sources → your pixel
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              <AlertCircle className="w-4 h-4 inline mr-2" />
              What to set up
            </h2>
            <div className="space-y-3">
              {[
                { title: "Google Search Console", desc: "Submit your sitemap and monitor search performance", link: "https://search.google.com/search-console" },
                { title: "Google Analytics", desc: "Track visitors, page views, and user behaviour", link: "https://analytics.google.com" },
                { title: "Facebook Pixel", desc: "Track conversions and retarget visitors on Facebook/Instagram", link: "https://business.facebook.com/events-manager" },
                { title: "Google Business Profile", desc: "Appear in local search results and Google Maps", link: "https://business.google.com" },
                { title: "Bing Webmaster Tools", desc: "Optimise for Bing and DuckDuckGo search", link: "https://www.bing.com/webmasters" },
              ].map((item) => (
                <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verification */}
      {activeTab === "verification" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Domain Verification
            </h2>
            <p className="text-xs text-muted mb-4">Paste the verification codes from each platform. These are added as meta tags to verify you own the domain.</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Google Search Console</label>
                <input value={seo.google_verification || ""} onChange={(e) => update("google_verification", e.target.value)} className={inputClass} placeholder="google-site-verification content value" />
                <p className={helpClass}>From Search Console → Settings → Ownership verification → HTML tag</p>
              </div>
              <div>
                <label className={labelClass}>Bing Webmaster</label>
                <input value={seo.bing_verification || ""} onChange={(e) => update("bing_verification", e.target.value)} className={inputClass} placeholder="msvalidate.01 content value" />
              </div>
              <div>
                <label className={labelClass}>Facebook Domain Verification</label>
                <input value={seo.facebook_domain_verification || ""} onChange={(e) => update("facebook_domain_verification", e.target.value)} className={inputClass} placeholder="facebook-domain-verification content value" />
                <p className={helpClass}>From Facebook Business Suite → Brand Safety → Domains</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced */}
      {activeTab === "advanced" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Structured Data (Schema.org)
            </h2>
            <p className="text-xs text-muted mb-4">Helps Google understand your business and show rich results (knowledge panel, logo, contact info)</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Business Name</label>
                <input value={seo.schema_org_name || ""} onChange={(e) => update("schema_org_name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Logo</label>
                <ImageDropzone
                  value={seo.schema_org_logo || ""}
                  settingKey="schema_org_logo"
                  onUploaded={(url) => update("schema_org_logo", url)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input value={seo.schema_org_phone || ""} onChange={(e) => update("schema_org_phone", e.target.value)} className={inputClass} placeholder="+44 123 456 7890" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input value={seo.schema_org_email || ""} onChange={(e) => update("schema_org_email", e.target.value)} className={inputClass} placeholder="hello@doorlist.co.uk" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input value={seo.schema_org_address || ""} onChange={(e) => update("schema_org_address", e.target.value)} className={inputClass} placeholder="Manchester, UK" />
              </div>
            </div>
          </div>

          {/* Schema Preview */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Generated JSON-LD
            </h2>
            <pre className="bg-ink text-white/80 p-4 rounded-xl text-xs overflow-x-auto">
              {JSON.stringify(
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: seo.schema_org_name || "Doorlist",
                  url: seo.site_url || "https://doorlist.co.uk",
                  logo: seo.schema_org_logo || undefined,
                  telephone: seo.schema_org_phone || undefined,
                  email: seo.schema_org_email || undefined,
                  address: seo.schema_org_address
                    ? { "@type": "PostalAddress", addressLocality: seo.schema_org_address }
                    : undefined,
                  sameAs: seo.twitter_handle
                    ? [`https://twitter.com/${seo.twitter_handle.replace("@", "")}`]
                    : undefined,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className={sectionTitle} style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
              Canonical URL
            </h2>
            <div>
              <label className={labelClass}>Override Canonical URL</label>
              <input value={seo.canonical_url || ""} onChange={(e) => update("canonical_url", e.target.value)} className={inputClass} placeholder="Leave empty to use site URL (recommended)" />
              <p className={helpClass}>Only set this if your site is accessible from multiple URLs and you want to tell Google which one is the &ldquo;real&rdquo; one</p>
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <div className="mt-6">
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
