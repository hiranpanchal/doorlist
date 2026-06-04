"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

export default function ReviewSubmitForm() {
  const [form, setForm] = useState({ name: "", role: "Tenant", rating: 5, title: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    setSent(true);
  }

  const inputClass = "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  if (sent) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#00b67a" }} />
        <p className="font-bold text-ink text-lg" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>Thank you!</p>
        <p className="text-sm text-muted mt-1">Your review has been submitted and is awaiting approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Your Name <span className="text-red-400">*</span></label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Full name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">I am a...</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
            <option>Tenant</option>
            <option>Landlord</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Rating <span className="text-red-400">*</span></label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="p-0.5">
              <div className="w-9 h-9 flex items-center justify-center rounded transition-transform hover:scale-110" style={{ background: n <= form.rating ? "#00b67a" : "#dcdce6" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Review Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Sum up your experience in a few words" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Your Review <span className="text-red-400">*</span></label>
        <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} className={`${inputClass} resize-none`} placeholder="Tell us about your experience..." />
      </div>
      <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50" style={{ background: "#00b67a" }}>
        <Send className="w-4 h-4" />
        {sending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
