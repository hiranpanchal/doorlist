"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Plus, Trash2, Star, Eye, EyeOff, Pencil, X } from "lucide-react";
import { TrustpilotStars } from "@/components/TrustpilotStars";

type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  title: string;
  body: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
};

function ReviewForm({
  review,
  onSave,
  onCancel,
}: {
  review?: Review;
  onSave: (data: Partial<Review>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: review?.name || "",
    role: review?.role || "Tenant",
    rating: review?.rating || 5,
    title: review?.title || "",
    body: review?.body || "",
    published: review?.published ?? true,
    featured: review?.featured ?? false,
  });

  const inputClass = "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
          {review ? "Edit Review" : "Add Review"}
        </h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-surface"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
            <option>Tenant</option>
            <option>Landlord</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setForm({ ...form, rating: n })} className="p-1">
              <div className="w-8 h-8 flex items-center justify-center rounded" style={{ background: n <= form.rating ? "#00b67a" : "#dcdce6" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Review Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Short summary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Review</label>
        <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> Published
        </label>
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Featured on homepage
        </label>
      </div>
      <button
        onClick={() => onSave(review ? { id: review.id, ...form } : form)}
        className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--color-ink)" }}
      >
        {review ? "Update" : "Add Review"}
      </button>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function load() {
    fetch("/api/admin/reviews").then((r) => r.json()).then((d) => { setReviews(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Partial<Review>) {
    if (data.id) {
      await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/admin/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditing(null);
    setAdding(false);
    load();
  }

  async function togglePublish(review: Review) {
    await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: review.id, published: !review.published }) });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  const published = reviews.filter((r) => r.published);
  const pending = reviews.filter((r) => !r.published);

  if (loading) return <div className="max-w-5xl mx-auto animate-pulse h-64 bg-surface-2 rounded-2xl" />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Reviews</h1>
          <p className="text-sm text-muted mt-0.5">{published.length} published · {pending.length} pending</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--color-ink)" }}>
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {adding && <div className="mb-6"><ReviewForm onSave={handleSave} onCancel={() => setAdding(false)} /></div>}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((r) => editing === r.id ? (
              <ReviewForm key={r.id} review={r} onSave={handleSave} onCancel={() => setEditing(null)} />
            ) : (
              <div key={r.id} className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TrustpilotStars rating={r.rating} size="sm" />
                      <span className="text-sm font-semibold text-ink">{r.name}</span>
                      <span className="text-xs text-muted">{r.role}</span>
                    </div>
                    {r.title && <p className="text-sm font-semibold text-ink mb-1">{r.title}</p>}
                    <p className="text-sm text-ink-2">{r.body}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => togglePublish(r)} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200" title="Publish"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => setEditing(r.id)} className="p-1.5 rounded-lg bg-white text-muted hover:bg-gray-100" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published */}
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Published ({published.length})</h2>
      <div className="space-y-3">
        {published.map((r) => editing === r.id ? (
          <ReviewForm key={r.id} review={r} onSave={handleSave} onCancel={() => setEditing(null)} />
        ) : (
          <div key={r.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TrustpilotStars rating={r.rating} size="sm" />
                  <span className="text-sm font-semibold text-ink">{r.name}</span>
                  <span className="text-xs text-muted">{r.role}</span>
                  {r.featured && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">Featured</span>}
                </div>
                {r.title && <p className="text-sm font-semibold text-ink mb-1">{r.title}</p>}
                <p className="text-sm text-ink-2">{r.body}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => togglePublish(r)} className="p-1.5 rounded-lg bg-gray-100 text-muted hover:bg-gray-200" title="Unpublish"><EyeOff className="w-4 h-4" /></button>
                <button onClick={() => setEditing(r.id)} className="p-1.5 rounded-lg bg-gray-100 text-muted hover:bg-gray-200" title="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
