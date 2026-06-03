"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    bio: "",
    website: "",
    city: "",
    county: "",
    logo: "",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            company: data.company || "",
            bio: data.bio || "",
            website: data.website || "",
            city: data.city || "",
            county: data.county || "",
            logo: data.logo || "",
          });
        }
      });
  }, []);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";

  return (
    <div className="max-w-4xl mx-auto">
      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Your Profile
      </h1>
      <p className="text-sm text-muted mb-8">
        This information appears on your listings and your public landlord
        profile.
      </p>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-xl mb-6">
          <CheckCircle className="w-4 h-4" />
          Profile saved successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo & Company */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Brand
          </h2>
          <div className="flex items-start gap-6 mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden"
              style={{ background: form.logo ? "transparent" : "var(--color-accent)" }}
            >
              {form.logo ? (
                <img
                  src={form.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                form.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              )}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Logo URL</label>
              <input
                value={form.logo}
                onChange={(e) => update("logo", e.target.value)}
                className={inputClass}
                placeholder="https://example.com/your-logo.png"
              />
              <p className="text-xs text-muted mt-1">
                Paste a URL to your company logo (square image recommended)
              </p>
            </div>
          </div>
          <div>
            <label className={labelClass}>Company / Trading Name</label>
            <input
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className={inputClass}
              placeholder="e.g. Whitaker Properties Ltd"
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Contact Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="07700 000000"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className={inputClass}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Location & Bio */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2
            className="text-base font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            About You
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Manchester"
                />
              </div>
              <div>
                <label className={labelClass}>County</label>
                <input
                  value={form.county}
                  onChange={(e) => update("county", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Greater Manchester"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Tell tenants a bit about yourself and your properties..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
          style={{ background: "var(--color-ink)" }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
